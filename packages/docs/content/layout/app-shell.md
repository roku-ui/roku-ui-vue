# AppShell

A flexible layout component that provides a structured shell for your application with support for Header, Navbar, Main, Footer, and Aside sections.

## Features

- **Flexible Layout**: Compose Header, Navbar, Main, Footer, and Aside sections
- **Spanning Controls**: Header and Footer can span across Navbar and/or Aside
- **Customizable Dimensions**: Configure heights, widths, padding, and gaps
- **CSS Grid Based**: Built with CSS Grid for responsive and flexible layouts
- **UnoCSS Styling**: Uses utility classes for consistent styling

## Usage

### Basic Layout

::Demo{demo="AppShell/Base"}
::

### Minimal Layouts

::Demo{demo="AppShell/Minimal"}
::

### Responsive Sizes

::Demo{demo="AppShell/Responsive"}
::

## API

### Props

| Name               | Type      | Default   | Description                        |
| ------------------ | --------- | --------- | ---------------------------------- |
| `headerHeight`     | `string`  | `'64px'`  | Height of the header section       |
| `footerHeight`     | `string`  | `'64px'`  | Height of the footer section       |
| `navbarWidth`      | `string`  | `'280px'` | Width of the navbar section        |
| `asideWidth`       | `string`  | `'280px'` | Width of the aside section         |
| `headerSpansNav`   | `boolean` | `false`   | Whether header spans across navbar |
| `headerSpansAside` | `boolean` | `false`   | Whether header spans across aside  |
| `footerSpansNav`   | `boolean` | `false`   | Whether footer spans across navbar |
| `footerSpansAside` | `boolean` | `false`   | Whether footer spans across aside  |
| `padding`          | `string`  | `'16px'`  | Padding for the entire shell       |
| `gap`              | `string`  | `'16px'`  | Gap between sections               |

### Slots

| Name      | Description                |
| --------- | -------------------------- |
| `header`  | Header content             |
| `navbar`  | Navigation sidebar content |
| `default` | Main content area          |
| `aside`   | Right sidebar content      |
| `footer`  | Footer content             |

## Examples

### Full Layout

```vue
<AppShell
  header-height="80px"
  navbar-width="300px"
  :header-spans-nav="true"
  :header-spans-aside="true"
>
  <template #header>
    <div class="bg-primary text-white px-4 py-2">
      Application Header
    </div>
  </template>

  <template #navbar>
    <nav class="p-4">
      <ul class="space-y-2">
        <li><a href="#" class="block py-2 px-3 rounded hover:bg-gray-100">Dashboard</a></li>
        <li><a href="#" class="block py-2 px-3 rounded hover:bg-gray-100">Users</a></li>
        <li><a href="#" class="block py-2 px-3 rounded hover:bg-gray-100">Settings</a></li>
      </ul>
    </nav>
  </template>

  <main class="p-4">
    <h1 class="text-2xl font-bold mb-4">Main Content</h1>
    <p>Your main application content goes here.</p>
  </main>

  <template #aside>
    <div class="p-4">
      <h3 class="font-medium mb-2">Sidebar</h3>
      <div class="space-y-2">
        <div class="p-2 bg-gray-100 rounded">Widget 1</div>
        <div class="p-2 bg-gray-100 rounded">Widget 2</div>
      </div>
    </div>
  </template>

  <template #footer>
    <div class="bg-gray-100 px-4 py-2">
      © 2024 Your Company
    </div>
  </template>
</AppShell>
```

### Simple Header + Main

```vue
<AppShell header-height="60px">
  <template #header>
    <div class="bg-primary text-white px-4 py-2">
      Simple Header
    </div>
  </template>

  <div class="p-4">
    <h1>Main Content</h1>
    <p>Just header and main content.</p>
  </div>
</AppShell>
```

### Sidebar Layout

```vue
<AppShell navbar-width="250px">
  <template #navbar>
    <nav class="p-4">
      <h3 class="font-medium mb-4">Navigation</h3>
      <!-- Navigation items -->
    </nav>
  </template>

  <main class="p-4">
    <h1>Content with Sidebar</h1>
    <!-- Main content -->
  </main>
</AppShell>
```

## Layout Combinations

The AppShell component supports various layout combinations based on which slots are provided:

- **Header + Main**: Simple top bar with content
- **Navbar + Main**: Sidebar navigation with content
- **Main + Aside**: Content with right sidebar
- **Header + Navbar + Main**: Top bar with sidebar navigation
- **Full Layout**: All sections (Header, Navbar, Main, Aside, Footer)

The spanning props allow you to control whether the header and footer extend across the navbar and aside sections, providing maximum flexibility for your layout needs.
