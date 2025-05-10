import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

export function loadTemplate(templateName: string, data: Record<string, any>): string {
  // Construct path to the template file
  const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.html`);
  
  // Read the template file
  const template = fs.readFileSync(templatePath, 'utf8');
  
  // Compile the template
  const compiledTemplate = handlebars.compile(template);
  
  return compiledTemplate(data);
}