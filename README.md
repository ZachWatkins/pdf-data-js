# PDF Data Visualization using JavaScript

## Process

The initial process involves the following steps:

1. Collect Data
2. Create Template
3. Format Data for Template
4. Combine Data and Template into PDF

Options for managing complexity and change:

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