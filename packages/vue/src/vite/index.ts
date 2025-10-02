import type { Options as AutoImportOptions } from 'unplugin-auto-import/types'
import type { ComponentResolver, Options as ComponentsPluginOptions } from 'unplugin-vue-components'
import type { PluginOption } from 'vite'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

const PACKAGE_NAME = '@roku-ui/vue'
const COMPONENT_DECLARATION_PATH = 'components/index.d.ts'
const ENTRY_DECLARATION_PATH = 'index.d.ts'
const DEFAULT_PREFIX = 'R'

interface ComponentManifestItem {
  name: string
}

interface RokuUiResolverOptions {
  prefix: string
}

type RokuUiComponentsOptions = Pick<ComponentsPluginOptions, 'dts'>

export interface RokuUiPluginOptions {
  prefix?: string | false
  components?: boolean | RokuUiComponentsOptions
  autoImport?: boolean | Partial<AutoImportOptions>
}

let cachedComponentManifest: ComponentManifestItem[] | null = null
let componentManifestWarningIssued = false
let cachedAutoImportEntries: string[] | null = null
let autoImportWarningIssued = false

function createCamelCaseVariants(value: string): string[] {
  if (!value) {
    return []
  }

  const lowerCased = value.charAt(0).toLowerCase() + value.slice(1)
  if (lowerCased === value) {
    return [value]
  }

  return [value, lowerCased]
}

function toKebabCase(value: string): string {
  return value
    .replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replaceAll(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

function toFilePath(url: string): string {
  const { pathname } = new URL(url)
  const decodedPath = decodeURIComponent(pathname)

  if (process.platform === 'win32') {
    return path.normalize(decodedPath.startsWith('/') ? decodedPath.slice(1) : decodedPath)
  }

  return path.normalize(decodedPath)
}

function resolveDistPath(relativePath: string): string | null {
  const currentFile = toFilePath(import.meta.url)
  const currentDir = path.dirname(currentFile)
  const distRoot = path.resolve(currentDir, '..')
  const manifestCandidates = [
    path.join(distRoot, relativePath),
    path.join(path.resolve(currentDir, '..', '..', 'dist'), relativePath),
  ]

  for (const candidate of manifestCandidates) {
    if (existsSync(candidate)) {
      return candidate
    }
  }

  return null
}

function loadComponentManifest(): ComponentManifestItem[] {
  if (cachedComponentManifest) {
    return cachedComponentManifest
  }

  try {
    const declarationPath = resolveDistPath(COMPONENT_DECLARATION_PATH)

    if (!declarationPath) {
      if (!componentManifestWarningIssued) {
        componentManifestWarningIssued = true
        console.warn('[roku-ui] Unable to locate component declaration manifest. Auto registration is disabled.')
      }

      cachedComponentManifest = []
      return cachedComponentManifest
    }

    const declarationContent = readFileSync(declarationPath, 'utf8')
    cachedComponentManifest = parseComponentManifest(declarationContent)
    return cachedComponentManifest
  }
  catch (error) {
    if (!componentManifestWarningIssued) {
      componentManifestWarningIssued = true
      console.warn('[roku-ui] Failed to read component declaration manifest.', error)
    }

    cachedComponentManifest = []
    return cachedComponentManifest
  }
}

function parseComponentManifest(content: string): ComponentManifestItem[] {
  const items: ComponentManifestItem[] = []
  const exportPattern = /export\s+\{\s+default\s+as\s+(\w+)\s+\}\s+from\s+'\.\/[\w/.-]+';/g
  let match: RegExpExecArray | null = exportPattern.exec(content)

  while (match !== null) {
    const componentName = match[1]

    if (componentName) {
      items.push({ name: componentName })
    }

    match = exportPattern.exec(content)
  }

  return items
}

function normalizeAutoImportSpecifier(specifier: string): string | null {
  const trimmed = specifier.trim()

  if (!trimmed || trimmed.startsWith('type ')) {
    return null
  }

  const aliasMatch = trimmed.match(/(?:^|\s)as\s+(\w+)/)
  if (aliasMatch && aliasMatch[1]) {
    return aliasMatch[1]
  }

  const defaultExportMatch = trimmed.match(/default\s+as\s+(\w+)/)
  if (defaultExportMatch && defaultExportMatch[1]) {
    return defaultExportMatch[1]
  }

  const directMatch = trimmed.match(/^(\w+)/)
  if (directMatch && typeof directMatch[1] === 'string') {
    return directMatch[1]
  }

  return null
}

function parseAutoImportManifest(content: string, excluded: Set<string>): string[] {
  const names = new Set<string>()

  const valuePattern = /export\s+declare\s+(?:const|let|var|function)\s+(\w+)/g
  let valueMatch: RegExpExecArray | null = valuePattern.exec(content)

  while (valueMatch !== null) {
    const exportName = valueMatch[1]
    if (exportName && !excluded.has(exportName)) {
      names.add(exportName)
    }

    valueMatch = valuePattern.exec(content)
  }

  const namedExportPattern = /export\s+\{([^}]+)\}\s*(?:from\s+['"][^'"]+['"])?/g
  let namedMatch: RegExpExecArray | null = namedExportPattern.exec(content)

  while (namedMatch !== null) {
    const block = namedMatch[1]
    if (!block) {
      namedMatch = namedExportPattern.exec(content)
      continue
    }
    const specifiers = block.split(',')

    for (const specifier of specifiers) {
      const exportName = normalizeAutoImportSpecifier(specifier)

      if (exportName && !excluded.has(exportName)) {
        names.add(exportName)
      }
    }

    namedMatch = namedExportPattern.exec(content)
  }

  return [...names]
}

function loadAutoImportEntries(): string[] {
  if (cachedAutoImportEntries) {
    return cachedAutoImportEntries
  }

  try {
    const declarationPath = resolveDistPath(ENTRY_DECLARATION_PATH)

    if (!declarationPath) {
      if (!autoImportWarningIssued) {
        autoImportWarningIssued = true
        console.warn('[roku-ui] Unable to locate entry declaration manifest. Auto imports are disabled.')
      }

      cachedAutoImportEntries = []
      return cachedAutoImportEntries
    }

    const content = readFileSync(declarationPath, 'utf8')
    const componentNames = new Set(loadComponentManifest().map(item => item.name))
    cachedAutoImportEntries = parseAutoImportManifest(content, componentNames)
    return cachedAutoImportEntries
  }
  catch (error) {
    if (!autoImportWarningIssued) {
      autoImportWarningIssued = true
      console.warn('[roku-ui] Failed to read entry declaration manifest.', error)
    }

    cachedAutoImportEntries = []
    return cachedAutoImportEntries
  }
}

function createNameCandidates(componentName: string, prefix: string): Set<string> {
  const names = new Set<string>()
  const prefixed = prefix ? `${prefix}${componentName}` : componentName

  for (const variant of createCamelCaseVariants(prefixed)) {
    names.add(variant)
    names.add(toKebabCase(variant))
  }

  return names
}

function createResolver(options: RokuUiResolverOptions): ComponentResolver {
  const manifest = loadComponentManifest()
  const entries = manifest.map(item => ({
    importName: item.name,
    names: createNameCandidates(item.name, options.prefix),
  }))

  return (componentName) => {
    const normalizedCandidates = new Set<string>([
      componentName,
      toKebabCase(componentName),
      ...createCamelCaseVariants(componentName),
    ])

    for (const entry of entries) {
      for (const candidate of normalizedCandidates) {
        if (entry.names.has(candidate)) {
          return { name: entry.importName, from: PACKAGE_NAME }
        }
      }
    }
  }
}

function createComponentsPlugin(options: RokuUiPluginOptions, prefix: string): PluginOption | undefined {
  if (options.components === false) {
    return undefined
  }

  const resolver = createResolver({ prefix })
  const componentOptions = typeof options.components === 'object' ? options.components : {}

  return Components({
    dts: componentOptions.dts ?? 'components.d.ts',
    resolvers: [resolver],
  })
}

function createAutoImportPlugin(options: RokuUiPluginOptions): PluginOption | undefined {
  if (options.autoImport === false) {
    return undefined
  }

  const entries = loadAutoImportEntries()
  const autoImportOptions = typeof options.autoImport === 'object' ? options.autoImport : {}
  const { imports: userImports, dts: userDts, ...rest } = autoImportOptions

  const baseImports: AutoImportOptions['imports'] = entries.length > 0
    ? [{ [PACKAGE_NAME]: entries }]
    : []

  const mergedImports: AutoImportOptions['imports'] = Array.isArray(userImports)
    ? [...baseImports, ...userImports]
    : (userImports
        ? [...baseImports, userImports]
        : baseImports)

  if (Array.isArray(mergedImports) && mergedImports.length === 0) {
    return undefined
  }

  return AutoImport({
    dts: userDts ?? 'auto-imports.d.ts',
    imports: mergedImports,
    ...rest,
  })
}

export function rokuUI(options: RokuUiPluginOptions = {}): PluginOption[] {
  const prefix = options.prefix === false ? '' : options.prefix ?? DEFAULT_PREFIX
  const componentsPlugin = createComponentsPlugin(options, prefix)
  const autoImportPlugin = createAutoImportPlugin(options)

  return flattenPluginOptions([componentsPlugin, autoImportPlugin])
}

function flattenPluginOptions(options: (PluginOption | undefined)[]): PluginOption[] {
  const result: PluginOption[] = []

  const spread = (value: PluginOption | PluginOption[] | undefined | null): void => {
    if (!value) {
      return
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        spread(entry)
      }
      return
    }

    result.push(value)
  }

  for (const option of options) {
    spread(option)
  }

  return result
}

export default rokuUI
