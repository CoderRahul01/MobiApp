# Changelog

## MSW and Shadcn Integration Fix - [Date: March 9, 2023]

### Problem Resolved
Fixed the persistent issue with MSW postinstall scripts failing when adding shadcn components using `bunx --bun shadcn@latest add <component>`. This error would prevent components from being properly installed:

```
  ⚙️  msw [1/1] error: could not determine executable to run for package exec
error: postinstall script from "msw" exited with 1
```

### Solutions Implemented

1. **Configuration Files Created/Modified:**
   - Created `.npmrc` with settings to ignore scripts and manage dependencies
   - Added environment variables in `.env` to disable MSW postinstall scripts
   - Set up custom scripts for safely installing shadcn components

2. **Installation Scripts:**
   - Created `install-component.ps1` - PowerShell script for Windows users
   - Created `install-component.sh` - Bash script for non-Windows users
   - Created `scripts/add-component.mjs` - Node.js script for cross-platform use

3. **Package.json Updates:**
   - Added custom commands for component installation:
     - `component:add` - For Windows users
     - `component:add:unix` - For Unix/Linux/Mac users
     - `shadcn:add` - Using Node.js script

4. **Components Added:**
   - `sidebar.tsx` - With `Sidebar`, `SidebarInset`, `SidebarNav`, and `SidebarFooter` components
   - `textarea.tsx` - Fixed TypeScript interface issues

### How to Use

#### Adding New shadcn Components

**For Windows Users:**
```
bun run component:add <component-name>
```

**For Unix/Linux/Mac Users:**
```
bun run component:add:unix <component-name>
```

**Using Node.js Script (Cross-Platform):**
```
bun run shadcn:add <component-name>
```

#### How the Scripts Work
1. Temporarily disables `.npmrc` to avoid script restrictions
2. Sets environment variables to bypass MSW postinstall issues
3. Runs the shadcn command with error handling
4. Filters out MSW-related errors from the output
5. Restores configuration files after installation

### Technical Details

The solution works by:
1. Temporarily disabling the `ignore-scripts=true` setting in `.npmrc`
2. Using environment variables like `SKIP_MSW_POSTINSTALL=true` to prevent MSW's service worker initialization
3. Running shadcn with the correct flags and error handling
4. Gracefully handling errors and always restoring the original configuration

### File Changes

- **New Files:**
  - `install-component.ps1`
  - `install-component.sh`
  - `scripts/add-component.mjs`
  - `components/ui/sidebar.tsx` 
  - `components/ui/textarea.tsx`

- **Modified Files:**
  - `.npmrc`
  - `package.json`
  - `.env`

### Notes
- If you encounter any issues with adding components, try running the commands with `--verbose` for more detailed error output.
- Make sure to have the latest versions of bun and Node.js installed.
- Some components may require additional dependencies, which should be automatically installed by the scripts. 