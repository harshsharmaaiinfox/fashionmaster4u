import re
import json

def generate_sitemap():
    base_url = "https://fashionmaster4u.com"
    lastmod = "2026-04-01"

    # Static pages (Priority 0.5 and 0.6)
    static_pages = [
        {"loc": "/", "priority": "1.0", "changefreq": "daily"},
        {"loc": "/about-us", "priority": "0.5", "changefreq": "monthly"},
        {"loc": "/contact-us", "priority": "0.5", "changefreq": "monthly"},
        {"loc": "/privacy-policy", "priority": "0.5", "changefreq": "yearly"},
        {"loc": "/return-policy", "priority": "0.5", "changefreq": "yearly"},
        {"loc": "/refund-and-cancellation", "priority": "0.5", "changefreq": "yearly"},
        {"loc": "/term-condition", "priority": "0.5", "changefreq": "yearly"},
        {"loc": "/shipping-policy", "priority": "0.5", "changefreq": "yearly"},
        {"loc": "/order/tracking", "priority": "0.6", "changefreq": "weekly"},
        {"loc": "/blogs", "priority": "0.6", "changefreq": "daily"},
    ]

    # Category pages (Priority 0.8)
    categories = ["activewear", "men", "women"]
    category_pages = [{"loc": f"/category/{cat}", "priority": "0.8", "changefreq": "weekly"} for cat in categories]
    collection_pages = [{"loc": "/collections", "priority": "0.8", "changefreq": "weekly"}]

    # Product pages (Priority 0.7)
    product_slugs = set()
    product_meta_path = r"c:\fashionmaster4u\src\app\shared\data\product-meta-data.ts"
    
    with open(product_meta_path, 'r', encoding='utf-8') as f:
        content = f.read()
        # Look for canonical_url: "https://raylomshop.com/product/slug"
        # Using a regex to find all slugs
        matches = re.finditer(r'"canonical_url":\s*"https?://[^/]+/product/([^"]+)"', content)
        for match in matches:
            product_slugs.add(match.group(1))

    product_pages = [{"loc": f"/product/{slug}", "priority": "0.7", "changefreq": "weekly"} for slug in sorted(list(product_slugs))]

    # Combine all
    all_pages = static_pages + category_pages + collection_pages + product_pages

    # Unique check
    unique_pages = {page['loc']: page for page in all_pages}
    final_pages = sorted(unique_pages.values(), key=lambda x: x['loc'])

    # Build XML
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for page in final_pages:
        xml += '  <url>\n'
        xml += f'    <loc>{base_url}{page["loc"]}</loc>\n'
        xml += f'    <lastmod>{lastmod}</lastmod>\n'
        xml += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
        xml += f'    <priority>{page["priority"]}</priority>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'

    with open(r'c:\fashionmaster4u\src\sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(xml)

    print(f"Generated sitemap with {len(final_pages)} URLs.")

if __name__ == "__main__":
    generate_sitemap()
