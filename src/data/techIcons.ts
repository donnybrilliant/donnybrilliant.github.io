export interface TechIcon {
  icon: string;
  label: string;
  color: string;
}

// Color palette that cycles through theme colors
const colorPalette = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--tertiary))",
  "hsl(var(--quad))",
  "hsl(var(--accent))",
];

const getColorForIndex = (index: number): string => {
  return colorPalette[index % colorPalette.length];
};

export const techIcons: TechIcon[] = [
  // Programming Languages
  { icon: "simple-icons:javascript", label: "JavaScript" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:typescript", label: "TypeScript" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:python", label: "Python" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:go", label: "Go" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:php", label: "PHP" , color: 'hsl(var(--accent))' },

  // Web Frameworks & Libraries
  { icon: "simple-icons:react", label: "React" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:vuedotjs", label: "Vue.js" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:nextdotjs", label: "Next.js" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:remix", label: "Remix" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:astro", label: "Astro" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:express", label: "Express" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:fastify", label: "Fastify" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:fastapi", label: "FastAPI" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:flask", label: "Flask" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:django", label: "Django" , color: 'hsl(var(--accent))' },

  // CSS & Styling
  { icon: "simple-icons:tailwindcss", label: "Tailwind CSS" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:bootstrap", label: "Bootstrap" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:sass", label: "Sass" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:less", label: "Less" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:stylus", label: "Stylus" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:postcss", label: "PostCSS" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:styledcomponents", label: "Styled Components" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:mui", label: "Material-UI" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:chakraui", label: "Chakra UI" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:antdesign", label: "Ant Design" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:bulma", label: "Bulma" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:semanticuireact", label: "Semantic UI React" , color: 'hsl(var(--secondary))' },

  // Build Tools & Bundlers
  { icon: "simple-icons:vite", label: "Vite" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:webpack", label: "Webpack" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:turborepo", label: "Turborepo" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:nx", label: "Nx" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:babel", label: "Babel" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:eslint", label: "ESLint" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:prettier", label: "Prettier" , color: 'hsl(var(--quad))' },

  // Runtime & Platforms
  { icon: "simple-icons:nodedotjs", label: "Node.js" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:deno", label: "Deno" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:bun", label: "Bun" , color: 'hsl(var(--secondary))' },

  // Databases
  { icon: "simple-icons:mongodb", label: "MongoDB" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:postgresql", label: "PostgreSQL" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:mysql", label: "MySQL" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:sqlite", label: "SQLite" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:redis", label: "Redis" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:elasticsearch", label: "Elasticsearch" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:firebase", label: "Firebase" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:supabase", label: "Supabase" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:prisma", label: "Prisma" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:drizzle", label: "Drizzle" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:neo4j", label: "Neo4j" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:cockroachlabs", label: "CockroachDB" , color: 'hsl(var(--quad))' },

  // Cloud & Infrastructure
  { icon: "simple-icons:amazonaws", label: "AWS" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:googlecloud", label: "Google Cloud" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:vercel", label: "Vercel" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:netlify", label: "Netlify" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:cloudflare", label: "Cloudflare" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:digitalocean", label: "DigitalOcean" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:heroku", label: "Heroku" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:render", label: "Render" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:docker", label: "Docker" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:kubernetes", label: "Kubernetes" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:githubactions", label: "GitHub Actions" , color: 'hsl(var(--accent))' },

  // Version Control
  { icon: "simple-icons:git", label: "Git" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:github", label: "GitHub" , color: 'hsl(var(--secondary))' },

  // Testing
  { icon: "simple-icons:jest", label: "Jest" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:vitest", label: "Vitest" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:cypress", label: "Cypress" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:selenium", label: "Selenium" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:mocha", label: "Mocha" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:puppeteer", label: "Puppeteer" , color: 'hsl(var(--tertiary))' },

  // Design Tools
  { icon: "simple-icons:figma", label: "Figma" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:adobexd", label: "Adobe XD" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:sketch", label: "Sketch" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:canva", label: "Canva" , color: 'hsl(var(--secondary))' },

  // CMS & Content
  { icon: "simple-icons:wordpress", label: "WordPress" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:contentful", label: "Contentful" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:sanity", label: "Sanity" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:strapi", label: "Strapi" , color: 'hsl(var(--primary))' },

  // Desktop
  { icon: "simple-icons:electron", label: "Electron" , color: 'hsl(var(--secondary))' },

  // API & Backend
  { icon: "simple-icons:graphql", label: "GraphQL" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:postman", label: "Postman" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:swagger", label: "Swagger" , color: 'hsl(var(--accent))' },

  // Real-time & WebSockets
  { icon: "simple-icons:socketdotio", label: "Socket.io" , color: 'hsl(var(--primary))' },

  // Authentication & Security
  { icon: "simple-icons:auth0", label: "Auth0" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:passport", label: "Passport" , color: 'hsl(var(--tertiary))' },

  // Monitoring & Analytics
  { icon: "simple-icons:sentry", label: "Sentry" , color: 'hsl(var(--quad))' },

  // Payment
  { icon: "simple-icons:stripe", label: "Stripe" , color: 'hsl(var(--accent))' },

  // Documentation
  { icon: "simple-icons:readthedocs", label: "Read the Docs" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:docusaurus", label: "Docusaurus" , color: 'hsl(var(--secondary))' },

  // Package Managers
  { icon: "simple-icons:npm", label: "npm" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:yarn", label: "Yarn" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:pnpm", label: "pnpm" , color: 'hsl(var(--accent))' },

  // HTML & Markup
  { icon: "simple-icons:html5", label: "HTML5" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:css3", label: "CSS3" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:markdown", label: "Markdown" , color: 'hsl(var(--tertiary))' },
  { icon: "simple-icons:pug", label: "Pug" , color: 'hsl(var(--quad))' },

  // Operating Systems
  { icon: "simple-icons:linux", label: "Linux" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:apple", label: "macOS" , color: 'hsl(var(--primary))' },
  { icon: "simple-icons:ubuntu", label: "Ubuntu" , color: 'hsl(var(--secondary))' },
  { icon: "simple-icons:debian", label: "Debian" , color: 'hsl(var(--tertiary))' },

  // Other Popular Tools & Services
  { icon: "simple-icons:amazon", label: "Amazon" , color: 'hsl(var(--quad))' },
  { icon: "simple-icons:shopify", label: "Shopify" , color: 'hsl(var(--accent))' },
  { icon: "simple-icons:woo", label: "WooCommerce" , color: 'hsl(var(--primary))' },
];
