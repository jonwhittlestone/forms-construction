# Next.js Application Structure

```mermaid
graph LR
    A[Next.js App] --> B[Pages]
    A --> C[Components]
    A --> D[Lib]
    A --> E[Netlify Functions]

    subgraph Pages
    B --> B1[_app.tsx]
    B --> B2[_document.tsx]
    B --> B3["[slug].tsx"]
    B --> B4[index.tsx]
    end

    subgraph Components
    C --> C1[Features]
    C --> C2[Shared]
    C --> C3[Templates]

    C1 --> C1A[CTF Components]
    C1 --> C1B[LandingPageEmailForm]
    C1 --> C1C[Section Headlines]

    C1A --> C1A1[Footer]
    C1A --> C1A2[Navigation]
    C1A --> C1A3[Hero Banner]
    C1A --> C1A4[Other Components...]

    C2 --> C2A[Component Resolver]
    C2 --> C2B[Error Box]
    C2 --> C2C[Link]

    C3 --> C3A[Header]
    C3 --> C3B[Layout]
    C3 --> C3C[Page Container]
    end

    subgraph Libraries
    D --> D1[GraphQL Client]
    D --> D2[Fetch Config]
    D --> D3[Server-side Translations]
    end

    subgraph Netlify
    E --> E1[send-email.ts]
    end

    style A fill:#f9f,stroke:#333,stroke-width:4px
    style B fill:#bbf,stroke:#333
    style C fill:#bfb,stroke:#333
    style D fill:#fbb,stroke:#333
    style E fill:#fbf,stroke:#333
```

## Directory Structure Overview

- **/pages**: Next.js routing and page components
  - Dynamic routes and app configuration
- **/components**: React components organized by feature
  - Features: Main functional components
  - Shared: Reusable utility components
  - Templates: Layout and structural components
- **/lib**: Core utilities and configurations
  - GraphQL setup
  - API configurations
  - Translation utilities
- **/netlify/functions**: Serverless functions
  - Email handling
  - API integrations

The application follows a feature-based architecture with Contentful integration (CTF components) and internationalization support. Components are organized by their role (features, shared, templates) for better maintainability and scalability.
