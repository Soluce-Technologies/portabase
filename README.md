<br />
<div align="center">
  <a href="https://portabase.io">
    <img src="/public/images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Portabase</h3>

  <p align="center">
    Easily backup and restore your database instances with Portabase
    <br />
    <a href="https://portabase.io"><strong>Explore the Docs »</strong></a>
    <br />
    <br />
    <a href="https://www.youtube.com/watch?v=D9uFrGxLc4s">View Demo</a>
    ·
    <a href="https://github.com/Soluce-Technologies/portabase/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/Soluce-Technologies/portabase/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
 
  ![portabase-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/e3929e58-fefd-44cc-ab26-6f8e1a860c43)
  
  </p>
</div>




## 📚 Table of Contents

- [About The Project](#about-the-project)
    - [Built With](#built-with)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## About The Project

**Portabase** is a server dashboard tool designed to simplify the backup and restoration of your database instances. It integrates seamlessly with Portabase agents for managing operations securely and efficiently.

GitHub Repository: [Portabase](https://github.com/Soluce-Technologies/portabase)

### 🔧 Built With

- [![NextJS][NextJS]][NextJS-url] (v15 with App Router)
- [![Drizzle][Drizzle]][Drizzle-url]
- [![ShadcnUI][ShadcnUI]][ShadcnUI-url]
- BetterAuth
- React Email

---

## 🚀 Getting Started

### Prerequisites

Ensure Docker is installed on your machine before getting started.

### Installation

To run Portabase locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/Soluce-Technologies/portabase
    cd portabase
    ```
2. Start the development environment:
    ```bash
    docker compose up
    ```

---

## 🛠️ Usage

Portabase provides a dashboard to manage database instances and backups. It supports:

- PostgreSQL (current)
- MongoDB (coming soon)
- MySQL (coming soon)

You can access the dashboard at `http://localhost:3000` after starting the project.

---

## 🗺️ Roadmap

- [ ] Add changelog
- [ ] Enhance documentation
- [ ] Implement testing procedures
- [ ] Include release file
- [ ] Improve security
- [ ] Enhance UX/UI
- [ ] Improve workspace management system
- [x] Migrate to Drizzle ORM
- [ ] Add multi-language support
- [ ] Extend multi-database support:
    - [x] PostgreSQL
    - [ ] MongoDB
    - [ ] MySQL

Check out [open issues](https://github.com/Soluce-Technologies/portabase/issues) for more.

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get started:

1. Fork the repository
2. Create a new branch:
    ```bash
    git checkout -b feature/YourFeature
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add YourFeature"
    ```
4. Push to the branch:
    ```bash
    git push origin feature/YourFeature
    ```
5. Open a pull request

Give the project a ⭐ if you like it!

### Top Contributors

[![Contributors](https://contrib.rocks/image?repo=Soluce-Technologies/portabase)](https://github.com/Soluce-Technologies/portabase/graphs/contributors)

---

## Developer Notes

### Environment Variables

```yml
# Environment
NODE_ENV=production

# Database
DATABASE_URL=postgresql://devuser:changeme@db:5432/devdb?schema=public

# Project Info
NEXT_PUBLIC_PROJECT_NAME="Portabase"
NEXT_PUBLIC_PROJECT_DESCRIPTION="Portabase is a powerful database manager"
NEXT_PUBLIC_PROJECT_URL=http://app.portabase.io
PROJECT_SECRET=

# SMTP (Email)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# S3/MinIO Configuration
S3_ENDPOINT=http://app.s3.portabase.io
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET_NAME=portabase
S3_PORT=9000
S3_USE_SSL=true

# Storage Backend: 'local' or 's3'
STORAGE_TYPE=local

# Retention
RETENTION_CRON="* * * * *"
```

### Semantic Versioning

Use the following format for Docker image versioning:

```bash
major.minor.patch-rc.release
# Example: 1.0.0-rc.1

major.minor.patch-rc.release-tag
# Example: 1.0.0-rc.1-dev
```

---

## 📄 License

Distributed under the Apache License. See `LICENSE.txt` for more details.

---

## 📬 Contact

- Killian Larcher - killian.larcher@soluce-technologies.com
- Charles Gauthereau - charles.gauthereau@soluce-technologies.com
- Project Link: [Portabase GitHub](https://github.com/Soluce-Technologies/portabase)

---

## 🙏 Acknowledgments

Thanks to all contributors and the open-source community!

---

[NextJS]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Drizzle]: https://img.shields.io/badge/Drizzle-111?style=for-the-badge&logo=Drizzle&logoColor=c5f74f
[ShadcnUI]: https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcn/ui&logoColor=white
[NextJS-url]: https://nextjs.org/
[Drizzle-url]: https://orm.drizzle.team/
[ShadcnUI-url]: https://ui.shadcn.com/
