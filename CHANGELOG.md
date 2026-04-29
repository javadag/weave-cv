
## v2.1.0


### 🚀 Enhancements

- Add 'present' prop to resume components for current status indication ([5d13bb4](https://github.com/JavadAg/weave-cv/commit/5d13bb4))
- Implement add section ([3671654](https://github.com/JavadAg/weave-cv/commit/3671654))
- Add heading icon support and migration for new schema version ([801a8fc](https://github.com/JavadAg/weave-cv/commit/801a8fc))
- Enhance personal details section with icon support and new StyledIcon component ([ef744ef](https://github.com/JavadAg/weave-cv/commit/ef744ef))
- Enhance SEO and meta tags ([adb8587](https://github.com/JavadAg/weave-cv/commit/adb8587))
- Add landing page ([5baafbd](https://github.com/JavadAg/weave-cv/commit/5baafbd))
- Enhance delete and visibility components with tooltip support ([4158a84](https://github.com/JavadAg/weave-cv/commit/4158a84))
- Implement template selection with dynamic loading and improved styling ([19d52f3](https://github.com/JavadAg/weave-cv/commit/19d52f3))
- Add loading skeleton components for resume preview and sections forms ([21af74d](https://github.com/JavadAg/weave-cv/commit/21af74d))
- Implement resume limit checks and disable actions accordingly ([df002f0](https://github.com/JavadAg/weave-cv/commit/df002f0))
- Add template screenshots and enhance template selection modal with image display ([9bf2b79](https://github.com/JavadAg/weave-cv/commit/9bf2b79))
- Add MiniResumePreview component for enhanced resume display in ResumeCardContent ([bf0d845](https://github.com/JavadAg/weave-cv/commit/bf0d845))
- Integrate @vueuse/motion for enhanced animations and transitions across landing page components ([7423f8c](https://github.com/JavadAg/weave-cv/commit/7423f8c))
- Add CONTRIBUTING.md, LICENSE, and update README with setup instructions and features ([be15b22](https://github.com/JavadAg/weave-cv/commit/be15b22))
- Add UserDropdown ([1c60e89](https://github.com/JavadAg/weave-cv/commit/1c60e89))
- Add resetStyles function to Toolbar for clearing text formatting ([168f8a2](https://github.com/JavadAg/weave-cv/commit/168f8a2))
- Add showDateDay option to date components and update date formatting logic ([23005f3](https://github.com/JavadAg/weave-cv/commit/23005f3))
- Add optional width prop to TitleSubtitle ([aad575c](https://github.com/JavadAg/weave-cv/commit/aad575c))
- Enable showDateDay option for experience, education, course, award, and project data ([99cd193](https://github.com/JavadAg/weave-cv/commit/99cd193))
- Add Tailwind CSS CLI support and integrate custom CSS for PDF generation ([ac17fa0](https://github.com/JavadAg/weave-cv/commit/ac17fa0))
- Add responsive for resume page ([1d420f6](https://github.com/JavadAg/weave-cv/commit/1d420f6))
- Enhance loadTailwindCss function to support multiple loading strategies ([2376a03](https://github.com/JavadAg/weave-cv/commit/2376a03))
- Add RTL layout support for resume preview ([7513c61](https://github.com/JavadAg/weave-cv/commit/7513c61))
- Add underline and color options for personal details ([8545772](https://github.com/JavadAg/weave-cv/commit/8545772))
- Implement draggable functionality for section contents and update content on reorder ([68d3eb4](https://github.com/JavadAg/weave-cv/commit/68d3eb4))
- Enhance section title display with fallback capitalization ([72582a4](https://github.com/JavadAg/weave-cv/commit/72582a4))
- Add GitHub link button to user dropdown for easy access ([d970409](https://github.com/JavadAg/weave-cv/commit/d970409))
- Scaffold v2.0 with i18n, theming, PWA assets, and AI deps ([ea69cae](https://github.com/JavadAg/weave-cv/commit/ea69cae))

### 🩹 Fixes

- Column colors in title subtitle ([5c19d30](https://github.com/JavadAg/weave-cv/commit/5c19d30))
- Resume pdf font ([4692329](https://github.com/JavadAg/weave-cv/commit/4692329))
- Logo size ([4fb8398](https://github.com/JavadAg/weave-cv/commit/4fb8398))
- Small issues ([b9066d6](https://github.com/JavadAg/weave-cv/commit/b9066d6))
- Skipping empty paragraph nodes, empty space at new page ([4690c0b](https://github.com/JavadAg/weave-cv/commit/4690c0b))
- Increase maxlength for resume title input from 30 to 50 characters ([15cfb40](https://github.com/JavadAg/weave-cv/commit/15cfb40))
- Remove unused code ([a117d3e](https://github.com/JavadAg/weave-cv/commit/a117d3e))
- Small bugs ([f7b05fe](https://github.com/JavadAg/weave-cv/commit/f7b05fe))
- Add missing location to projects, fix name and role font size ([4f61d10](https://github.com/JavadAg/weave-cv/commit/4f61d10))
- Update TypeScript SDK path and improve component structure ([ba29e4a](https://github.com/JavadAg/weave-cv/commit/ba29e4a))
- Handle potential null values in personal details and improve icon layout ([bfba7f1](https://github.com/JavadAg/weave-cv/commit/bfba7f1))
- Adjust line height for personal details seprator ([e5facb2](https://github.com/JavadAg/weave-cv/commit/e5facb2))
- Remove Export ([4963c31](https://github.com/JavadAg/weave-cv/commit/4963c31))
- Update field labels for clarity and consistency in section forms ([7c2835d](https://github.com/JavadAg/weave-cv/commit/7c2835d))
- Project link, empty names ([6c7e41e](https://github.com/JavadAg/weave-cv/commit/6c7e41e))
- Remove decoration for non link ([ef50b0d](https://github.com/JavadAg/weave-cv/commit/ef50b0d))
- Really fixed underline ([36add29](https://github.com/JavadAg/weave-cv/commit/36add29))

### 💅 Refactors

- Resume preview ([3b44b71](https://github.com/JavadAg/weave-cv/commit/3b44b71))
- Update resume components to use HtmlWithSeparator and improve conditional rendering ([63ac01f](https://github.com/JavadAg/weave-cv/commit/63ac01f))
- Streamline resume component structure and remove unused files ([6af41f0](https://github.com/JavadAg/weave-cv/commit/6af41f0))
- Update font handling and configuration in resume components ([3f127a0](https://github.com/JavadAg/weave-cv/commit/3f127a0))
- Enhance resume component structure, add new download functionality, and update dependencies ([f2f46b2](https://github.com/JavadAg/weave-cv/commit/f2f46b2))
- Improve link icon and detail wrapper components with enhanced styling and props handling ([f071502](https://github.com/JavadAg/weave-cv/commit/f071502))
- Restructure resume components, introduce new CreateResumeButton and TemplateSelectionModal, and update environment configuration ([4b6b590](https://github.com/JavadAg/weave-cv/commit/4b6b590))
- Update resume header ([d55607e](https://github.com/JavadAg/weave-cv/commit/d55607e))
- Remove nuxt-color-picker dependency and update color picker component with hex validation ([8867269](https://github.com/JavadAg/weave-cv/commit/8867269))
- Changes to dummy data and sections single item ([1ae4db5](https://github.com/JavadAg/weave-cv/commit/1ae4db5))
- Update useConfigsStore implementation across components for improved state management ([244b9da](https://github.com/JavadAg/weave-cv/commit/244b9da))
- Simplify advanced section element generation and update indent constraint in general configs ([6b5a535](https://github.com/JavadAg/weave-cv/commit/6b5a535))
- Remove console log for title validation in resume update handler ([21ae638](https://github.com/JavadAg/weave-cv/commit/21ae638))
- Update landing page ([7a64e12](https://github.com/JavadAg/weave-cv/commit/7a64e12))
- Streamline resume refresh handling in dashboard component ([a3f1860](https://github.com/JavadAg/weave-cv/commit/a3f1860))
- Update Google sign-in ([8916602](https://github.com/JavadAg/weave-cv/commit/8916602))
- Update resume component types and streamline section handling ([8d2a244](https://github.com/JavadAg/weave-cv/commit/8d2a244))
- Improve state management in SectionsOrderControl component and resume store for better layout handling ([16dfc9b](https://github.com/JavadAg/weave-cv/commit/16dfc9b))
- Simplify menuItems ([8951c1f](https://github.com/JavadAg/weave-cv/commit/8951c1f))
- Renamed components ([e2ab493](https://github.com/JavadAg/weave-cv/commit/e2ab493))
- Remove letterSpacing from typography settings and related components ([c4a1e16](https://github.com/JavadAg/weave-cv/commit/c4a1e16))
- Remove unused generateBlocksSingleColumn function ([ae49333](https://github.com/JavadAg/weave-cv/commit/ae49333))
- Update BasicConfigs to conditionally render based on SECTION_CONFIGS_CONFIG ([1f92542](https://github.com/JavadAg/weave-cv/commit/1f92542))
- Enhance layout and spacing calculations in various components ([17a65ba](https://github.com/JavadAg/weave-cv/commit/17a65ba))
- Adjust marker size calculations and improve CSS properties in ListItem component ([3435e4f](https://github.com/JavadAg/weave-cv/commit/3435e4f))
- Conditionally render Visibility and Delete components based on section type ([49090ed](https://github.com/JavadAg/weave-cv/commit/49090ed))
- Rename variables and functions for clarity in content processing and rendering ([101ac7c](https://github.com/JavadAg/weave-cv/commit/101ac7c))
- Improve content rendering structure ([c444beb](https://github.com/JavadAg/weave-cv/commit/c444beb))
- Remove unused components ([4f7af3a](https://github.com/JavadAg/weave-cv/commit/4f7af3a))
- Auto wrap date/location ([e1c18b7](https://github.com/JavadAg/weave-cv/commit/e1c18b7))
- Improved alignment and add padding ([eb4ab73](https://github.com/JavadAg/weave-cv/commit/eb4ab73))

### 🏡 Chore

- Add commitlint ([04fc755](https://github.com/JavadAg/weave-cv/commit/04fc755))

### ❤️ Contributors

- Javadag <j.aghebati93@gmail.com>
- Javad Aghebati <j.aghebati93@gmail.com>
- JavadAg <j.aghebati93@gmail.com>

## ...master


### 🚀 Enhancements

- Add 'present' prop to resume components for current status indication ([5d13bb4](https://github.com/JavadAg/weave-cv/commit/5d13bb4))
- Implement add section ([3671654](https://github.com/JavadAg/weave-cv/commit/3671654))
- Add heading icon support and migration for new schema version ([801a8fc](https://github.com/JavadAg/weave-cv/commit/801a8fc))
- Enhance personal details section with icon support and new StyledIcon component ([ef744ef](https://github.com/JavadAg/weave-cv/commit/ef744ef))
- Enhance SEO and meta tags ([adb8587](https://github.com/JavadAg/weave-cv/commit/adb8587))
- Add landing page ([5baafbd](https://github.com/JavadAg/weave-cv/commit/5baafbd))
- Enhance delete and visibility components with tooltip support ([4158a84](https://github.com/JavadAg/weave-cv/commit/4158a84))
- Implement template selection with dynamic loading and improved styling ([19d52f3](https://github.com/JavadAg/weave-cv/commit/19d52f3))
- Add loading skeleton components for resume preview and sections forms ([21af74d](https://github.com/JavadAg/weave-cv/commit/21af74d))
- Implement resume limit checks and disable actions accordingly ([df002f0](https://github.com/JavadAg/weave-cv/commit/df002f0))
- Add template screenshots and enhance template selection modal with image display ([9bf2b79](https://github.com/JavadAg/weave-cv/commit/9bf2b79))
- Add MiniResumePreview component for enhanced resume display in ResumeCardContent ([bf0d845](https://github.com/JavadAg/weave-cv/commit/bf0d845))
- Integrate @vueuse/motion for enhanced animations and transitions across landing page components ([7423f8c](https://github.com/JavadAg/weave-cv/commit/7423f8c))
- Add CONTRIBUTING.md, LICENSE, and update README with setup instructions and features ([be15b22](https://github.com/JavadAg/weave-cv/commit/be15b22))
- Add UserDropdown ([1c60e89](https://github.com/JavadAg/weave-cv/commit/1c60e89))
- Add resetStyles function to Toolbar for clearing text formatting ([168f8a2](https://github.com/JavadAg/weave-cv/commit/168f8a2))
- Add showDateDay option to date components and update date formatting logic ([23005f3](https://github.com/JavadAg/weave-cv/commit/23005f3))
- Add optional width prop to TitleSubtitle ([aad575c](https://github.com/JavadAg/weave-cv/commit/aad575c))
- Enable showDateDay option for experience, education, course, award, and project data ([99cd193](https://github.com/JavadAg/weave-cv/commit/99cd193))
- Add Tailwind CSS CLI support and integrate custom CSS for PDF generation ([ac17fa0](https://github.com/JavadAg/weave-cv/commit/ac17fa0))
- Add responsive for resume page ([1d420f6](https://github.com/JavadAg/weave-cv/commit/1d420f6))
- Enhance loadTailwindCss function to support multiple loading strategies ([2376a03](https://github.com/JavadAg/weave-cv/commit/2376a03))
- Add RTL layout support for resume preview ([7513c61](https://github.com/JavadAg/weave-cv/commit/7513c61))
- Add underline and color options for personal details ([8545772](https://github.com/JavadAg/weave-cv/commit/8545772))
- Implement draggable functionality for section contents and update content on reorder ([68d3eb4](https://github.com/JavadAg/weave-cv/commit/68d3eb4))
- Enhance section title display with fallback capitalization ([72582a4](https://github.com/JavadAg/weave-cv/commit/72582a4))
- Add GitHub link button to user dropdown for easy access ([d970409](https://github.com/JavadAg/weave-cv/commit/d970409))
- Scaffold v2.0 with i18n, theming, PWA assets, and AI deps ([ea69cae](https://github.com/JavadAg/weave-cv/commit/ea69cae))

### 🩹 Fixes

- Column colors in title subtitle ([5c19d30](https://github.com/JavadAg/weave-cv/commit/5c19d30))
- Resume pdf font ([4692329](https://github.com/JavadAg/weave-cv/commit/4692329))
- Logo size ([4fb8398](https://github.com/JavadAg/weave-cv/commit/4fb8398))
- Small issues ([b9066d6](https://github.com/JavadAg/weave-cv/commit/b9066d6))
- Skipping empty paragraph nodes, empty space at new page ([4690c0b](https://github.com/JavadAg/weave-cv/commit/4690c0b))
- Increase maxlength for resume title input from 30 to 50 characters ([15cfb40](https://github.com/JavadAg/weave-cv/commit/15cfb40))
- Remove unused code ([a117d3e](https://github.com/JavadAg/weave-cv/commit/a117d3e))
- Small bugs ([f7b05fe](https://github.com/JavadAg/weave-cv/commit/f7b05fe))
- Add missing location to projects, fix name and role font size ([4f61d10](https://github.com/JavadAg/weave-cv/commit/4f61d10))
- Update TypeScript SDK path and improve component structure ([ba29e4a](https://github.com/JavadAg/weave-cv/commit/ba29e4a))
- Handle potential null values in personal details and improve icon layout ([bfba7f1](https://github.com/JavadAg/weave-cv/commit/bfba7f1))
- Adjust line height for personal details seprator ([e5facb2](https://github.com/JavadAg/weave-cv/commit/e5facb2))
- Remove Export ([4963c31](https://github.com/JavadAg/weave-cv/commit/4963c31))
- Update field labels for clarity and consistency in section forms ([7c2835d](https://github.com/JavadAg/weave-cv/commit/7c2835d))
- Project link, empty names ([6c7e41e](https://github.com/JavadAg/weave-cv/commit/6c7e41e))
- Remove decoration for non link ([ef50b0d](https://github.com/JavadAg/weave-cv/commit/ef50b0d))
- Really fixed underline ([36add29](https://github.com/JavadAg/weave-cv/commit/36add29))

### 💅 Refactors

- Resume preview ([3b44b71](https://github.com/JavadAg/weave-cv/commit/3b44b71))
- Update resume components to use HtmlWithSeparator and improve conditional rendering ([63ac01f](https://github.com/JavadAg/weave-cv/commit/63ac01f))
- Streamline resume component structure and remove unused files ([6af41f0](https://github.com/JavadAg/weave-cv/commit/6af41f0))
- Update font handling and configuration in resume components ([3f127a0](https://github.com/JavadAg/weave-cv/commit/3f127a0))
- Enhance resume component structure, add new download functionality, and update dependencies ([f2f46b2](https://github.com/JavadAg/weave-cv/commit/f2f46b2))
- Improve link icon and detail wrapper components with enhanced styling and props handling ([f071502](https://github.com/JavadAg/weave-cv/commit/f071502))
- Restructure resume components, introduce new CreateResumeButton and TemplateSelectionModal, and update environment configuration ([4b6b590](https://github.com/JavadAg/weave-cv/commit/4b6b590))
- Update resume header ([d55607e](https://github.com/JavadAg/weave-cv/commit/d55607e))
- Remove nuxt-color-picker dependency and update color picker component with hex validation ([8867269](https://github.com/JavadAg/weave-cv/commit/8867269))
- Changes to dummy data and sections single item ([1ae4db5](https://github.com/JavadAg/weave-cv/commit/1ae4db5))
- Update useConfigsStore implementation across components for improved state management ([244b9da](https://github.com/JavadAg/weave-cv/commit/244b9da))
- Simplify advanced section element generation and update indent constraint in general configs ([6b5a535](https://github.com/JavadAg/weave-cv/commit/6b5a535))
- Remove console log for title validation in resume update handler ([21ae638](https://github.com/JavadAg/weave-cv/commit/21ae638))
- Update landing page ([7a64e12](https://github.com/JavadAg/weave-cv/commit/7a64e12))
- Streamline resume refresh handling in dashboard component ([a3f1860](https://github.com/JavadAg/weave-cv/commit/a3f1860))
- Update Google sign-in ([8916602](https://github.com/JavadAg/weave-cv/commit/8916602))
- Update resume component types and streamline section handling ([8d2a244](https://github.com/JavadAg/weave-cv/commit/8d2a244))
- Improve state management in SectionsOrderControl component and resume store for better layout handling ([16dfc9b](https://github.com/JavadAg/weave-cv/commit/16dfc9b))
- Simplify menuItems ([8951c1f](https://github.com/JavadAg/weave-cv/commit/8951c1f))
- Renamed components ([e2ab493](https://github.com/JavadAg/weave-cv/commit/e2ab493))
- Remove letterSpacing from typography settings and related components ([c4a1e16](https://github.com/JavadAg/weave-cv/commit/c4a1e16))
- Remove unused generateBlocksSingleColumn function ([ae49333](https://github.com/JavadAg/weave-cv/commit/ae49333))
- Update BasicConfigs to conditionally render based on SECTION_CONFIGS_CONFIG ([1f92542](https://github.com/JavadAg/weave-cv/commit/1f92542))
- Enhance layout and spacing calculations in various components ([17a65ba](https://github.com/JavadAg/weave-cv/commit/17a65ba))
- Adjust marker size calculations and improve CSS properties in ListItem component ([3435e4f](https://github.com/JavadAg/weave-cv/commit/3435e4f))
- Conditionally render Visibility and Delete components based on section type ([49090ed](https://github.com/JavadAg/weave-cv/commit/49090ed))
- Rename variables and functions for clarity in content processing and rendering ([101ac7c](https://github.com/JavadAg/weave-cv/commit/101ac7c))
- Improve content rendering structure ([c444beb](https://github.com/JavadAg/weave-cv/commit/c444beb))
- Remove unused components ([4f7af3a](https://github.com/JavadAg/weave-cv/commit/4f7af3a))
- Auto wrap date/location ([e1c18b7](https://github.com/JavadAg/weave-cv/commit/e1c18b7))
- Improved alignment and add padding ([eb4ab73](https://github.com/JavadAg/weave-cv/commit/eb4ab73))

### 🏡 Chore

- Add commitlint ([04fc755](https://github.com/JavadAg/weave-cv/commit/04fc755))

### ❤️ Contributors

- Javadag <j.aghebati93@gmail.com>
- Javad Aghebati <j.aghebati93@gmail.com>
- JavadAg <j.aghebati93@gmail.com>

