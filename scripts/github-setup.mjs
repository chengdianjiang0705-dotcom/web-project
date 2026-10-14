// Read the existing OS credential into process memory. Never print or save tokens.
import { spawnSync } from 'node:child_process';
const owner = 'chengdianjiang0705-dotcom';
const repo = 'web-project';
const result = spawnSync('git', ['credential', 'fill'], {
  input: `protocol=https\nhost=github.com\nusername=${owner}\n\n`,
  encoding: 'utf8',
  env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' }
});
const token = result.stdout?.split(/\r?\n/).find(line => line.startsWith('password='))?.slice(9);
if (!token) throw new Error('No GitHub credential available. Complete the device login first.');
async function api(path, method = 'GET', body) {
  const request = {
    method,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'Outfit-Color-Lab-Setup', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {})
  };
  let response;
  // Read requests may be retried after transient connection failures; mutations are never blindly repeated.
  for (let attempt = 0; attempt < (method === 'GET' ? 3 : 1); attempt++) {
    try { response = await fetch(`https://api.github.com${path}`, { ...request, signal: AbortSignal.timeout(20000) }); break; }
    catch (error) { if (method !== 'GET' || attempt === 2) throw error; }
  }
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}
const user = await api('/user');
if (user.data.login?.toLowerCase() !== owner.toLowerCase()) throw new Error(`Authenticated account does not match ${owner}.`);
console.log(`Authenticated GitHub account: ${user.data.login}`);
if (process.argv.includes('--status')) {
  const repository = await api(`/repos/${owner}/${repo}`);
  const pages = await api(`/repos/${owner}/${repo}/pages`);
  const runs = await api(`/repos/${owner}/${repo}/actions/runs?per_page=3`);
  console.log(JSON.stringify({ repository: { status: repository.status, url: repository.data.html_url, private: repository.data.private }, pages: { status: pages.status, url: pages.data.html_url, buildType: pages.data.build_type }, runs: runs.data.workflow_runs?.map(run => ({ id: run.id, status: run.status, conclusion: run.conclusion, url: run.html_url })) }, null, 2));
} else if (process.argv.includes('--enable-pages')) {
  const current = await api(`/repos/${owner}/${repo}/pages`);
  const pages = current.status === 404
    ? await api(`/repos/${owner}/${repo}/pages`, 'POST', { build_type: 'workflow' })
    : current.data.build_type !== 'workflow'
      ? await api(`/repos/${owner}/${repo}/pages`, 'PUT', { build_type: 'workflow' })
      : current;
  if (pages.status >= 300) throw new Error(`Pages setup failed: HTTP ${pages.status}: ${pages.data.message}`);
  console.log(`GitHub Pages configured: ${pages.data.html_url || `https://${owner}.github.io/${repo}/`} (workflow)`);
} else if (process.argv.includes('--create')) {
  let repository = await api(`/repos/${owner}/${repo}`);
  if (repository.status === 404) {
    repository = await api('/user/repos', 'POST', { name: repo, description: 'Outfit Color Lab — interactive clothing color experiments. Web Technologies 2026 course project.', private: false, auto_init: false, has_issues: true, has_wiki: false });
  }
  if (repository.status >= 300) throw new Error(`Repository setup failed: HTTP ${repository.status}: ${repository.data.message}`);
  if (repository.data.private) throw new Error('Existing repository is private; refusing to silently change its audience.');
  console.log(`Public repository ready: ${repository.data.html_url}`);
} else throw new Error('Use --create, --enable-pages or --status.');
