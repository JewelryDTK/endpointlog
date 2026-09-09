import rawPosts from './posts.json';

export const topics = ['Endpoints', 'Security', 'Automation', 'AI & Copilot'] as const;
export const contentTypes = ['Guide', 'Build', 'Insight'] as const;

export type Topic = (typeof topics)[number];
export type ContentType = (typeof contentTypes)[number];

const summaries: Record<number, string> = {
  674: 'What the Windows Hello change means for sign-in, enrollment and identity teams.',
  647: 'A hands-on look at Microsoft 365 Copilot Wave 3 and the features that matter at work.',
  572: 'A PowerShell tool for finding and removing stale Intune objects with clear safeguards.',
  583: 'What the move to user-based licensing changes for Endpoint Privilege Management.',
  520: 'What happened when Microsoft 365 Copilot became part of my daily workflow.',
  438: 'Building a bulk workflow for Windows Autopilot group tags without repetitive admin work.',
  402: 'Platform SSO on macOS, tested from configuration through the end-user experience.',
  357: 'Exploring the practical role of Microsoft 365 Copilot agents in everyday work.',
};

const topicMap: Record<number, Topic[]> = {
  674: ['Security', 'Endpoints'], 647: ['AI & Copilot'], 572: ['Automation', 'Endpoints'],
  583: ['Endpoints'], 520: ['AI & Copilot'], 438: ['Automation', 'Endpoints'],
  402: ['Endpoints', 'Security'], 357: ['AI & Copilot'],
};

const typeMap: Record<number, ContentType> = {
  674: 'Guide', 647: 'Insight', 572: 'Build', 583: 'Insight',
  520: 'Insight', 438: 'Build', 402: 'Guide', 357: 'Insight',
};

export const posts = rawPosts.map((post) => ({
  ...post,
  summary: summaries[post.id],
  topics: topicMap[post.id],
  type: typeMap[post.id],
}));

export type Post = (typeof posts)[number];
export const articleUrl = (post: Post) => `/article/${post.slug}`;

export const toolDetails: Record<number, { problem: string; technology: string[]; outcome: string }> = {
  572: {
    problem: 'Inactive devices and duplicate records make an Intune tenant harder to trust and maintain.',
    technology: ['PowerShell', 'Microsoft Graph', 'Intune'],
    outcome: 'Review stale objects first, then remove only the records you approve.',
  },
  438: {
    problem: 'Assigning Windows Autopilot group tags one device at a time does not scale.',
    technology: ['PowerShell', 'Windows Autopilot', 'Microsoft Graph'],
    outcome: 'Apply group tags in bulk through a repeatable, auditable workflow.',
  },
};
