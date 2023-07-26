# Accessible PDFs Using Static Site Generation

The goal of this project is to demonstrate how to build accessible PDF files locally using web frameworks, libraries, and tools.

This project includes Node scripts for downloading, filtering, and converting XLSX files to JSON for use in a printable PDF file from a rendered web page. Two top-level NodeJS dependencies are used: xlsx and puppeteer.

Modules in the `src` folder are used by scripts in the `tasks` folder.

## Command Line Tasks

`npm run data` - Downloads the remote file configured in package.json to a local file and creates a filtered version in both `xlsx` and `json` format.
`npm run pdf:index` - Prints the web page at `public/index.html` using Puppeteer.

## Process

The initial process involves the following steps:

1. Collect Data
2. Create Template
3. Transform Data for Template
4. Apply Data to Template in PDF format

Details to consider when managing complexity and change:

1. Collect Data  
   a. JSON  
      - Easily read and write from databases, APIs, or by programmers using CLI tools  
      - Typed data (boolean, integer, decimal, array, etc)  
      - Widely available  
      - More challenging for non-programmers to create and maintain  
   b. CSV
      - Easily read and write  
      - Untyped data (strings by default)  
      - Widely available  
      - Non-programmers can create and maintain  
   c. XLSX
      - Proprietary  
      - Requires 3rd party library to read and write  
      - Typed data if 3rd party library supports it  
      - Non-programmers can create and maintain  
2. Create Template
   a. HTML/CSS/JS
      - Works with existing web content  
      - More control over data
      - Greater potential for working with large batches of documents or on demand  
      - Requires more programming time  
   b. Document Software  
      - Proprietary  
      - Reduces time spent programming the solution  
      - Involves designers more in the creation process  
      - More challenging to pull content from data sources  
3. Format Data for Template
   a. Command Line Tools (NodeJS, PHP, Bash)
      - Faster to reproduce  
      - Requires greater programming knowledge  
      - Can check source data for inconsistencies  
   b. Formatted Table (CSV or XLSX)
      - Low or no programming knowledge required  
      - No automatic data validation  
4. Combine Data and Template into PDF
   a. JavaScript or PHP
      - Can likely be integrated with a website  
      - Easier to perform at scale  
      - Requires programming knowledge  
      - Likely accessibility compliant  
   b. Document Software
      - Properietary features only and if supported  
      - Must be accessibility compliant  
      - Offline only  
      - Uses designers more than programmers  

Once this process is complete, it can be reduced to one steps for subsequent documents - Combine Data and Template into PDF - but this is more easily automated using code than using document software unless such a feature is well supported.

## Low Tech Approach

1. Collect Data - XLSX or CSV
2. Create Template - Document Software
3. Format Data for Template - Formatted Table
4. Combine Data and Template into PDF - Document Software

## Shared Work Approach

1. Collect Data - XLSX or CSV
2. Create Template - Document Software
3. Format Data for Template - Command Line Tools or Formatted Table
4. Combine Data and Template into PDF - Document Software with possible custom scripting

## Scalable Approach

1. Collect Data - XLSX or CSV
2. Create Template - HTML/CSS
3. Format Data for Template - Command Line Tools
4. Combine Data and Template into PDF - JavaScript or PHP

## Links

1. Web Content Templates: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots
2. Web to PDF Automation: https://blog.risingstack.com/pdf-from-html-node-js-puppeteer/
3. Data: https://www.dol.gov/agencies/wb/topics/childcare

## Data Source

https://www.dol.gov/sites/dolgov/files/WB/media/stats/nationaldatabaseofchildcareprices.xlsx

## Framework and Library Considerations

I may consider implementing the following libraries and frameworks in the future depending on how the project progresses.

### Static Site Generators

SSGs will help with accessibility by minimizing the complexity of the final document.

Options:

1. Eleventy https://www.11ty.dev/docs/accessibility/ (WCAG 2.1 AA)
2. Gatsby (React) https://www.gatsbyjs.com/accessibility-statement/ (partial WCAG 2.1 AA)
   1. https://www.gatsbyjs.com/docs/conceptual/making-your-site-accessible  
3. Astro https://astro.build/

### Design and Component Libraries

1. Material UI https://mui.com/core/ (WCAG 2.1 AA)
2. Chakra UI (React) https://chakra-ui.com/ ()
3. US Web Design System https://designsystem.digital.gov/documentation/accessibility/
   1. https://github.com/uswds/uswds  
4. Highcharts

## Additional Links

1. https://analytics.usa.gov/
2. https://designsystem.digital.gov/documentation/implementations/

## Accessibility

Static data visualization accessibility is most easily achieved with a good description of the visualization as if it were an image.

Interactive data visualizations are much more difficult.

### Accessible Component Libraries Considered

1. [USWDS](https://designsystem.digital.gov/) (U.S. General Services Administration)
2. [Cauldron](https://cauldron.dequelabs.com/) (Deque)
3. [Carbon Design System](https://github.com/carbon-design-system/carbon) (IBM)
4. [Material UI](https://mui.com/) (Based on Google Material Design)
5. [Fluent UI](https://developer.microsoft.com/en-us/fluentui) (Microsoft)
6. [Chakra UI](https://chakra-ui.com/)
7. [Radix UI](https://www.radix-ui.com/)
8. [AriaKit](https://github.com/ariakit/ariakit) (successor to Reakit)

No solution is future-proof. Choosing a component library trades away responsibility and gains expediency. More often than not, I prefer expediency over control and trust the component library to do its own testing for the level compliance it claims to support.

USWDS (U.S. General Services Administration) would be the safest choice since it was contracted for and is used by the United States federal government for their own accessibility compliance needs.

Cauldron (Deque) may be the second safest choice since it is made by a well known accessibility testing company, although usage statistics are low: [@deque/cauldron-react](https://www.npmjs.com/package/@deque/cauldron-react). It's only for React.

Carbon (IBM) has data visualizations while none of the other component libraries do. It has compatibility libraries for React and Vue.

Material UI is well known and also strives for WCAG 2.1 AA compliance.

## Links

1. https://nightingaledvs.com/writing-alt-text-for-data-visualization/
2. https://www.urban.org/sites/default/files/2022-12/Do%20No%20Harm%20Guide%20Centering%20Accessibility%20in%20Data%20Visualization.pdf
3. https://www.deque.com/blog/debunking-the-myth-accessibility-and-react/
4. https://blog.webdevsimplified.com/2021-03/dynamic-module-imports/
5. https://designsystem.digital.gov/documentation/developers/
