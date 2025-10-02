import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import AppShellDemo from './demo/AppShellDemo.vue'
import AvatarDemo from './demo/AvatarDemo.vue'
import ButtonDemo from './demo/ButtonDemo.vue'
import CalendarDemo from './demo/CalendarDemo.vue'
import CalendarInputDemo from './demo/CalendarInputDemo.vue'
import ChatDemo from './demo/ChatDemo.vue'
import ComponentDefaultsDemo from './demo/ComponentDefaultsDemo.vue'
import CSSVarDemo from './demo/CSSVarDemo.vue'
import FormDemo from './demo/FormDemo.vue'
import LayoutDemo from './demo/LayoutDemo.vue'
import MediaDemo from './demo/MediaDemo.vue'
import ModalDemo from './demo/ModalDemo.vue'
import ModernColorDemo from './demo/ModernColorDemo.vue'
import NavigationDemo from './demo/NavigationDemo.vue'
import NotificationDemo from './demo/NotificationDemo.vue'
import NumberFieldDemo from './demo/NumberFieldDemo.vue'
import PartialColorsDemo from './demo/PartialColorsDemo.vue'
import PopoverDemo from './demo/PopoverDemo.vue'
import ProgressDemo from './demo/ProgressDemo.vue'
import RatingDemo from './demo/RatingDemo.vue'
import SelectAreaDemo from './demo/SelectAreaDemo.vue'
import SelectDemo from './demo/SelectDemo.vue'
import SliderDemo from './demo/SliderDemo.vue'
import StepDemo from './demo/StepDemo.vue'
import SwitchDemo from './demo/SwitchDemo.vue'
import TagsDemo from './demo/TagsDemo.vue'
import TextFieldDemo from './demo/TextFieldDemo.vue'
import ThemeManagerDemo from './demo/ThemeManagerDemo.vue'
import TooltipDemo from './demo/TooltipDemo.vue'
import WaterfallDemo from './demo/WaterfallDemo.vue'

interface DemoPageRecord {
  key: string
  title: string
  component: Component
}

export const demoPages = [
  { key: 'CSSVars', title: 'CSS Variables', component: CSSVarDemo },
  { key: 'AppShell', title: 'App Shell', component: AppShellDemo },
  { key: 'Avatar', title: 'Avatar', component: AvatarDemo },
  { key: 'Button', title: 'Button', component: ButtonDemo },
  { key: 'Calendar', title: 'Calendar', component: CalendarDemo },
  { key: 'CalendarInput', title: 'Calendar Input', component: CalendarInputDemo },
  { key: 'Chat', title: 'Chat', component: ChatDemo },
  { key: 'ComponentDefaults', title: 'Component Defaults', component: ComponentDefaultsDemo },
  { key: 'Form', title: 'Form Controls', component: FormDemo },
  { key: 'Layout', title: 'Layout', component: LayoutDemo },
  { key: 'Media', title: 'Media & Colors', component: MediaDemo },
  { key: 'Modal', title: 'Modal & Drawer', component: ModalDemo },
  { key: 'NumberField', title: 'NumberField', component: NumberFieldDemo },
  { key: 'ModernColor', title: 'Modern Color System', component: ModernColorDemo },
  { key: 'Navigation', title: 'Navigation', component: NavigationDemo },
  { key: 'Notification', title: 'Notification', component: NotificationDemo },
  { key: 'PartialColors', title: 'Partial Colors', component: PartialColorsDemo },
  { key: 'Popover', title: 'Popover', component: PopoverDemo },
  { key: 'Progress', title: 'Progress', component: ProgressDemo },
  { key: 'Rating', title: 'Rating', component: RatingDemo },
  { key: 'Select', title: 'Select', component: SelectDemo },
  { key: 'SelectArea', title: 'Select Area', component: SelectAreaDemo },
  { key: 'Step', title: 'Step', component: StepDemo },
  { key: 'Tags', title: 'Tags', component: TagsDemo },
  { key: 'TextField', title: 'TextField', component: TextFieldDemo },
  { key: 'ThemeManager', title: 'Theme Manager', component: ThemeManagerDemo },
  { key: 'Tooltip', title: 'Tooltip', component: TooltipDemo },
  { key: 'Waterfall', title: 'Waterfall', component: WaterfallDemo },
  { key: 'Slider', title: 'Slider', component: SliderDemo },
  { key: 'Switch', title: 'Switch', component: SwitchDemo },
] as const satisfies readonly DemoPageRecord[]

export type DemoRouteName = typeof demoPages[number]['key']

function toKebabCase(value: DemoRouteName): string {
  return value.replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export const demoRoutes = demoPages.map(page => ({
  path: `/demo/${toKebabCase(page.key)}`,
  name: page.key,
  component: page.component,
  meta: { title: page.title },
})) satisfies readonly RouteRecordRaw[]

export const defaultDemoRouteName = demoPages[0].key

export function isDemoRouteName(value: string | null | undefined): value is DemoRouteName {
  return demoPages.some(page => page.key === value)
}
