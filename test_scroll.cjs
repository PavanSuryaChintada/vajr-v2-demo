const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });
  await page.goto('http://localhost:5174');
  
  // Wait for React and GSAP to load
  await page.waitForTimeout(3000);

  // Scroll to Signature section
  const signature = await page.$('#signature');
  if (signature) {
    await signature.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/atchyuthkarri/.gemini/antigravity-ide/brain/a935c6f5-e2f4-4ef2-8c92-84fea28a53a3/scratch/sig1.png' });

    // Scroll down 100vh to see the first slide transition
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/atchyuthkarri/.gemini/antigravity-ide/brain/a935c6f5-e2f4-4ef2-8c92-84fea28a53a3/scratch/sig2.png' });

    // Scroll to the end of the Signature section
    await page.evaluate(() => {
      const el = document.getElementById('signature');
      // scroll to where the signature section ends
      const rect = el.getBoundingClientRect();
      window.scrollBy(0, rect.bottom);
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/atchyuthkarri/.gemini/antigravity-ide/brain/a935c6f5-e2f4-4ef2-8c92-84fea28a53a3/scratch/sig3.png' });
  }

  await browser.close();
})();
