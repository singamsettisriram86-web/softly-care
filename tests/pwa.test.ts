import fs from 'fs';
import path from 'path';

describe('PWA Manifest & Service Worker', () => {
  it('validates public/manifest.json contains required PWA fields', () => {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(manifestContent.name).toContain('Softly');
    expect(manifestContent.start_url).toBe('/dashboard');
    expect(manifestContent.display).toBe('standalone');
    expect(manifestContent.theme_color).toBe('#FDFCF8');
  });

  it('validates public/sw.js service worker implementation', () => {
    const swPath = path.join(process.cwd(), 'public', 'sw.js');
    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, 'utf8');
    expect(swContent).toContain('CACHE_NAME');
    expect(swContent).toContain("addEventListener('install'");
    expect(swContent).toContain("addEventListener('fetch'");
  });
});
