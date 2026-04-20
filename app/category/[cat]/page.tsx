import { getAllPosts } from '../../../lib/posts'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ cat: string }> }

const CATEGORY_MAP: Record<string, { label: string; desc: string; keywords: string[] }> = {
  'coffee-makers': { label: 'Coffee Makers', desc: 'Best coffee makers, espresso machines, French presses and pour-over gear.', keywords: ['coffee maker','espresso machine','french press','pour over','drip coffee','nespresso','breville'] },
  'knives': { label: 'Kitchen Knives', desc: 'Top chef knives, knife sets, santoku blades and knife sharpeners reviewed.', keywords: ['chef knife','kitchen knife','santoku','knife set','sharpener','paring knife','wusthof','global'] },
  'cookware': { label: 'Cookware', desc: 'Best pots, pans, skillets and cookware sets for everyday cooking.', keywords: ['cookware','pots and pans','skillet','nonstick','cast iron','stainless steel','dutch oven','wok'] },
  'pressure-cookers': { label: 'Pressure Cookers', desc: 'Best pressure cookers, Instant Pots, air fryer combos and multi-cookers compared.', keywords: ['pressure cooker','instant pot','multi cooker','slow cooker','air fryer','ninja foodi','rice cooker'] },
  'blenders': { label: 'Blenders & Mixers', desc: 'Top blenders, food processors, immersion blenders and stand mixers reviewed.', keywords: ['blender','vitamix','ninja blender','food processor','immersion blender','stand mixer','kitchenaid'] },
  'air-fryers': { label: 'Air Fryers', desc: 'Best air fryers, toaster ovens and convection ovens for healthy crispy cooking.', keywords: ['air fryer','toaster oven','convection oven','ninja air fryer','philips','cosori','instant vortex'] },
  'food-storage': { label: 'Food Storage', desc: 'Best food containers, meal prep containers, vacuum sealers and pantry storage.', keywords: ['food container','meal prep','vacuum sealer','tupperware','glass containers','food storage','mason jar'] },
  'refrigerators': { label: 'Refrigerators', desc: 'Best refrigerators, mini fridges, beverage coolers and compact freezers reviewed.', keywords: ['refrigerator','mini fridge','beverage cooler','french door','side by side','smart fridge','freezer'] },
  'baking': { label: 'Baking Equipment', desc: 'Top baking sheets, cake pans, stand mixers, rolling pins and baking gear.', keywords: ['baking','baking sheet','cake pan','rolling pin','stand mixer','baking mat','springform','bundt pan'] },
  'thermometers': { label: 'Kitchen Thermometers', desc: 'Best meat thermometers, instant-read, probe and oven thermometers reviewed.', keywords: ['thermometer','meat thermometer','instant read','probe thermometer','thermoworks','oven thermometer'] },
  'kitchen-cleaning': { label: 'Kitchen Cleaning', desc: 'Best dish soaps, sponges, scrubbers, dish racks and kitchen cleaning products.', keywords: ['dish soap','sponge','scrubber','dish rack','cleaning spray','drying mat','kitchen cleaning'] },
  'kitchen-gadgets': { label: 'Kitchen Gadgets', desc: 'Best kitchen gadgets, tools, peelers, graters, mandolines and smart devices.', keywords: ['kitchen gadget','peeler','grater','mandoline','garlic press','can opener','kitchen tool','zester'] },
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((cat) => ({ cat }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params
  const cat = CATEGORY_MAP[cat]
  if (!cat) return {}
  return {
    title: `${cat.label} 2025 — Kitchen Ranked`,
    description: cat.desc,
    alternates: { canonical: `https://www.kitchenrankd.com/category/${cat}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { cat } = await params
  const cat = CATEGORY_MAP[cat]
  if (!cat) notFound()

  const all = getAllPosts()
  const kw = cat.keywords
  const matched = all.filter((p) => {
    const text = ((p.keyword || '') + ' ' + (p.title || '') + ' ' + (p.slug || '')).toLowerCase()
    return kw.some((k: string) => text.includes(k))
  })
  const posts = matched.length > 0 ? matched : all.slice(0, 12)

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#0a0a0a;--surface:#111111;--border:#1e1e1e;--text:#e4e4e7;--muted:#71717a;--accent:#f59e0b;--accent2:#ef4444;--radius:12px}
        body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.6}
        a{text-decoration:none;color:inherit}
        .container{max-width:1100px;margin:0 auto;padding:0 24px}
        .cat-hero{padding:60px 24px 48px;text-align:center;background:radial-gradient(ellipse 70% 50% at 50% 0%,color-mix(in srgb,#f59e0b 15%,transparent) 0%,transparent 70%)}
        .cat-badge{display:inline-block;padding:5px 16px;border-radius:20px;background:color-mix(in srgb,#f59e0b 12%,transparent);border:1px solid color-mix(in srgb,#f59e0b 30%,transparent);color:var(--accent);font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px}
        .cat-hero h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;letter-spacing:-0.03em;margin-bottom:12px}
        .cat-hero p{color:var(--muted);font-size:1rem;max-width:560px;margin:0 auto 24px}
        .breadcrumb{display:flex;align-items:center;gap:8px;font-size:0.8rem;color:var(--muted);justify-content:center;margin-bottom:32px}
        .breadcrumb a{color:var(--accent)}
        .post-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;padding-bottom:80px}
        .post-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px;display:flex;flex-direction:column;transition:border-color 0.15s,transform 0.15s}
        .post-card:hover{border-color:var(--accent);transform:translateY(-2px)}
        .post-tag{display:inline-block;padding:3px 10px;border-radius:20px;background:color-mix(in srgb,#f59e0b 10%,transparent);border:1px solid color-mix(in srgb,#f59e0b 25%,transparent);color:var(--accent);font-size:0.68rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:12px}
        .post-card h2{font-size:1rem;font-weight:700;line-height:1.4;margin-bottom:10px}
        .post-card h2 a:hover{color:var(--accent)}
        .post-card p{color:var(--muted);font-size:0.87rem;line-height:1.65;flex:1;margin-bottom:18px}
        .post-footer{display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid var(--border)}
        .post-date{font-size:0.72rem;color:var(--muted)}
        .post-link{font-size:0.82rem;color:var(--accent);font-weight:600}
        .empty{text-align:center;padding:80px 0;color:var(--muted)}
        @media(max-width:600px){.post-grid{grid-template-columns:1fr}}
      `}</style>

      <div className="cat-hero">
        <div className="cat-badge">Category</div>
        <h1>{cat.label}</h1>
        <p>{cat.desc}</p>
        <div className="breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <span>{cat.label}</span>
        </div>
      </div>

      <div className="container">
        {posts.length === 0 ? (
          <p className="empty">No articles yet — check back soon!</p>
        ) : (
          <div className="post-grid">
            {posts.map((post) => (
              <article className="post-card" key={post.slug}>
                {post.keyword && <span className="post-tag">{post.keyword}</span>}
                <h2><a href={`/${post.slug}`}>{post.title}</a></h2>
                <p>{post.description}</p>
                <div className="post-footer">
                  <span className="post-date">{post.date}</span>
                  <a href={`/${post.slug}`} className="post-link">Read →</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
