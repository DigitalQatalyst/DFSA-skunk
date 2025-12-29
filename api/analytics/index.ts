export const ANALYTIC_URI = 'https://kf-analytics-server.vercel.app';

export const url = (path: string) => `${ANALYTIC_URI}${path}`;

export default async (req: any, res: any) => {
  const response = await fetch(url(req.url), {
    method: req.method,
    headers: { 'Content-Type': 'application/json', ...req.headers },
    ...(req.body && { body: JSON.stringify(req.body) })
  });
  res.status(response.status).json(await response.json());
};






