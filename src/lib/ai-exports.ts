import { LOCALES, SITE, type Cv } from './cv';

const LANG_LABEL: Record<string, string> = {
  en: 'English',
  'pt-pt': 'Português (Portugal)',
  'pt-br': 'Português (Brasil)',
};

function isoDay(ym?: string): string | undefined {
  return ym ? `${ym}-01` : undefined;
}

function bullets(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

export function toMarkdown(cv: Cv): string {
  const b = cv.basics;
  const lines: string[] = [
    `# ${b.name}`,
    '',
    `**${b.nickname}** — ${b.title}`,
    '',
    b.tagline,
    '',
    `${b.location} · ${b.availability}`,
    '',
    `- Email: ${b.email}`,
    `- LinkedIn: ${b.linkedin}`,
    `- GitHub: ${b.github}`,
    `- Blog: ${b.blog}`,
    `- HTML: ${SITE}/${cv.locale}/`,
    '',
    b.nicknameStory,
    '',
    '## Summary',
    '',
    cv.summary,
    '',
    `## ${cv.quickFacts.title}`,
    '',
    bullets(cv.quickFacts.items.map((f) => f.text)),
    '',
    `## ${cv.kubernetes.title}`,
    '',
    cv.kubernetes.intro,
    '',
    bullets(cv.kubernetes.items),
    '',
    `## ${cv.howIWork.title}`,
    '',
    cv.howIWork.intro,
    '',
    ...cv.howIWork.items.flatMap((item) => [`### ${item.name}`, '', item.description, '']),
    `## ${cv.experience.title}`,
    '',
  ];

  for (const job of cv.experience.jobs) {
    lines.push(`### ${job.role} — ${job.company}`, '');
    lines.push(`${job.period} · ${job.location}`, '');
    lines.push(job.summary, '');
    lines.push(bullets(job.highlights), '');
  }

  lines.push(`## ${cv.skills.title}`, '');
  for (const group of cv.skills.groups) {
    lines.push(`### ${group.name}`, '', bullets(group.items), '');
  }

  lines.push(`## ${cv.certifications.title}`, '');
  lines.push(cv.certifications.kubestronaut, '');
  lines.push(bullets([...cv.certifications.featured, ...cv.certifications.others]), '');

  lines.push(`## ${cv.education.title}`, '');
  for (const edu of cv.education.items) {
    lines.push(`- **${edu.name}** — ${edu.org} (${edu.period})`);
  }

  lines.push('', `## ${cv.languages.title}`, '');
  for (const lang of cv.languages.items) {
    lines.push(`- **${lang.name}** — ${lang.level}`);
    if ('note' in lang && lang.note) lines.push(`  ${lang.note}`);
  }

  lines.push('', `## ${cv.blogSection.title}`, '', cv.blogSection.intro, '');
  lines.push(bullets(cv.blogSection.posts.map((p) => `${p.title} (${p.date})`)), '');

  return `${lines.join('\n').trim()}\n`;
}

function parseCert(raw: string): { name: string; issuer?: string } {
  const [name, issuer] = raw.split(' — ');
  return issuer ? { name: name.trim(), issuer: issuer.replace(/\s*\((?:expired|expirada)\)/i, '').trim() } : { name: raw };
}

export function toJsonResume(cv: Cv) {
  const b = cv.basics;
  const url = `${SITE}/${cv.locale}/`;

  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: b.name,
      label: b.title,
      image: `${SITE}/favicon.svg`,
      email: b.email,
      url,
      summary: cv.summary,
      location: {
        address: b.location,
        countryCode: 'PT',
      },
      profiles: [
        { network: 'LinkedIn', username: 'renatoruis', url: b.linkedin },
        { network: 'GitHub', username: 'renatoruis', url: b.github },
        { network: 'Blog', username: 'timdevops', url: b.blog },
      ],
    },
    work: cv.experience.jobs.map((job) => ({
      name: job.company,
      position: job.role,
      location: job.location,
      startDate: isoDay(job.start),
      ...(job.end ? { endDate: isoDay(job.end) } : {}),
      summary: job.summary,
      highlights: job.highlights,
    })),
    education: cv.education.items.map((edu) => ({
      institution: edu.org,
      area: edu.name,
      startDate: isoDay(edu.start),
      endDate: isoDay(edu.end),
    })),
    certificates: [...cv.certifications.featured, ...cv.certifications.others].map(parseCert),
    skills: cv.skills.groups.map((group) => ({
      name: group.name,
      keywords: group.items,
    })),
    languages: cv.languages.items.map((lang) => ({
      language: lang.name,
      fluency: lang.level,
    })),
    publications: cv.blogSection.posts.map((post) => ({
      name: post.title,
      publisher: 'timdevops.com.br',
      releaseDate: isoDay(post.date),
      url: b.blog,
    })),
  };
}

export function toLlmsTxt(): string {
  return `# Renato Ruis (Tim DevOps)

> Senior DevOps Engineer and CNCF Kubestronaut (CKA, CKAD, CKS, KCNA, KCSA). 8+ years in Kubernetes, multi-cloud (AWS, OCI, GCP), GitOps and FinOps. Remote from Portugal.

Canonical identity: Renato Ruis, also known as Tim DevOps. English is the canonical language for agents; Portuguese (Portugal) and Portuguese (Brazil) are translations of the same CV.

## CV

- [English CV (HTML)](${SITE}/en/): Canonical human-readable CV
- [English CV (Markdown)](${SITE}/en.md): Same content, LLM-friendly
- [English CV (JSON)](${SITE}/en.json): Native source data used by the site
- [JSON Resume](${SITE}/resume.json): JSON Resume schema (English)
- [Full text for agents](${SITE}/llms-full.txt): Complete English CV in one file
- [English PDF](${SITE}/pdf/renato-ruis-cv-en.pdf): Printable A4

## Translations

- [Português (Portugal)](${SITE}/pt-pt/): HTML · [Markdown](${SITE}/pt-pt.md) · [JSON](${SITE}/pt-pt.json) · [JSON Resume](${SITE}/pt-pt/resume.json)
- [Português (Brasil)](${SITE}/pt-br/): HTML · [Markdown](${SITE}/pt-br.md) · [JSON](${SITE}/pt-br.json) · [JSON Resume](${SITE}/pt-br/resume.json)

## Profiles

- [LinkedIn](https://www.linkedin.com/in/renatoruis/)
- [GitHub](https://github.com/renatoruis)
- [Blog (Portuguese)](https://timdevops.com.br)
`;
}

export function toLlmsFull(cvEn: Cv): string {
  const others = LOCALES.filter((l) => l !== 'en')
    .map((l) => `- ${LANG_LABEL[l]}: ${SITE}/${l}.md`)
    .join('\n');

  return `${toMarkdown(cvEn).trim()}

---

## Other languages

${others}
`;
}

type FaqItem = { q: string; a: string };

function faqFor(cv: Cv): FaqItem[] {
  const b = cv.basics;
  const english = cv.languages.items.find((l) => /english|inglês/i.test(l.name));
  const byLocale: Record<string, { who: string; where: string; english: string; contact: string; certs: string }> = {
    en: {
      who: 'Who is Renato Ruis (Tim DevOps)?',
      where: 'Where is Renato based and is he available remotely?',
      english: 'What is his English level?',
      contact: 'How can I contact Renato Ruis?',
      certs: 'What Kubernetes certifications does he hold?',
    },
    'pt-pt': {
      who: 'Quem é o Renato Ruis (Tim DevOps)?',
      where: 'Onde vive o Renato e está disponível em remoto?',
      english: 'Qual é o nível de inglês?',
      contact: 'Como posso contactar o Renato Ruis?',
      certs: 'Que certificações Kubernetes tem?',
    },
    'pt-br': {
      who: 'Quem é o Renato Ruis (Tim DevOps)?',
      where: 'Onde o Renato mora e ele está disponível remoto?',
      english: 'Qual é o nível de inglês?',
      contact: 'Como posso contactar o Renato Ruis?',
      certs: 'Quais certificações Kubernetes ele tem?',
    },
  };

  const q = byLocale[cv.locale] ?? byLocale.en;
  const locationFact = cv.quickFacts.items[0]?.text ?? `${b.location} · ${b.availability}`;

  return [
    { q: q.who, a: `${b.name}, also known as ${b.nickname}. ${b.title}. ${cv.summary}` },
    { q: q.where, a: locationFact },
    { q: q.english, a: english ? `${english.level}${english.note ? `. ${english.note}` : ''}` : '' },
    { q: q.contact, a: `${b.email} · ${b.linkedin}` },
    { q: q.certs, a: `${cv.certifications.kubestronaut}. ${cv.certifications.featured.join('; ')}` },
  ].filter((item) => item.a);
}

export function toJsonLd(cv: Cv, site = SITE) {
  const canonical = `${site}/${cv.locale}/`;
  const personId = `${site}/#renato-ruis`;
  const current = cv.experience.jobs[0];
  const skills = cv.skills.groups.flatMap((g) => g.items);
  const creds = [...cv.certifications.featured, ...cv.certifications.others];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': canonical,
        url: canonical,
        name: `${cv.basics.name} — ${cv.basics.title}`,
        inLanguage: cv.htmlLang,
        mainEntity: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: cv.basics.name,
        alternateName: cv.basics.nickname,
        description: cv.summary,
        jobTitle: cv.basics.title,
        email: `mailto:${cv.basics.email}`,
        url: canonical,
        sameAs: [cv.basics.linkedin, cv.basics.blog, cv.basics.github],
        address: { '@type': 'PostalAddress', addressCountry: 'PT' },
        knowsLanguage: ['pt', 'en'],
        hasOccupation: {
          '@type': 'Occupation',
          name: cv.basics.title,
          occupationLocation: { '@type': 'Country', name: 'Portugal' },
        },
        worksFor: {
          '@type': 'Organization',
          name: current.company,
        },
        alumniOf: cv.education.items.map((edu) => ({
          '@type': 'EducationalOrganization',
          name: edu.org,
        })),
        knowsAbout: skills,
        hasCredential: creds.map((name) => ({
          '@type': 'EducationalOccupationalCredential',
          name,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqFor(cv).map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };
}

export function markdownResponse(body: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export function jsonResponse(data: unknown): Response {
  return new Response(JSON.stringify(data, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
