export type HelpCenterType = 'Guide' | 'FAQ' | 'Walkthrough' | 'Video';
export type HelpCenterDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type HelpCenterStep = { title: string; content: string };
export type HelpCenterResource = { title: string; url: string };

export type HelpCenterArticle = {
  id: string;
  title: string;
  type: HelpCenterType;
  difficulty: HelpCenterDifficulty;
  category: string;
  description: string;
  content: string;
  steps: HelpCenterStep[];
  resources: HelpCenterResource[];
  tags: string[];
  readTime: string;
  lastUpdated: string;
  views: number;
  helpful: number;
  videoUrl?: string | null;
};

export type HelpCenterListResponse = {
  items: HelpCenterArticle[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type HelpCenterFilters = {
  search?: string;
  category?: string;
  type?: HelpCenterType;
  difficulty?: HelpCenterDifficulty;
  sort?: 'recent' | 'popular';
  page?: number;
  pageSize?: number;
  tag?: string;
};

export function mapApiArticleToHelpArticle(article: any): HelpCenterArticle {
  return {
    id: article.id,
    title: article.title,
    type: article.type,
    difficulty: article.difficulty,
    category: article.category || '',
    description: article.description || '',
    content: article.content || '',
    steps: article.steps || [],
    resources: article.resources || [],
    tags: article.tags || [],
    readTime: article.readTime || '',
    lastUpdated: article.lastUpdated || '',
    views: article.views || 0,
    helpful: article.helpful || 0,
    videoUrl: article.videoUrl,
  };
}
