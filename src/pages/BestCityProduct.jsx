import '../styles/bestcity-product.css';

export default function BestCityProduct() {
  return (
    <div className="bestcity-product-page">
      <header className="bestcity-product-hero">
        <div className="bestcity-product-container">
          <span className="bestcity-product-kicker">BestCity Real Estate Showcase</span>
          <h1>BestCity Skyline Residence</h1>
          <p>
            A modern luxury residence designed for buyers who want elegant city living,
            premium comfort, and convenient access to shopping, dining, and entertainment.
          </p>
        </div>
      </header>

      <main className="bestcity-product-container bestcity-product-main">
        <section className="bestcity-product-grid">
          <div className="bestcity-product-image-card">
            <img src="/bestcity00.png" alt="BestCity Skyline Residence" />
          </div>

          <div className="bestcity-product-details">
            <h2>Luxury Living in the Heart of the City</h2>
            <p>
              BestCity Skyline Residence combines contemporary architecture, spacious interiors,
              and a polished living experience for families, professionals, and investors seeking
              a standout property in a prime urban location.
            </p>

            <div className="bestcity-product-features">
              <article className="bestcity-feature-card">
                <h3>Prime Location</h3>
                <p>
                  Positioned near key business districts, shopping centers, restaurants,
                  and public transportation for everyday convenience.
                </p>
              </article>

              <article className="bestcity-feature-card">
                <h3>Modern Design</h3>
                <p>
                  Clean architectural lines, bright open spaces, and refined finishes create
                  a stylish and welcoming living environment.
                </p>
              </article>

              <article className="bestcity-feature-card">
                <h3>Smart Investment Value</h3>
                <p>
                  Built to attract homeowners and investors looking for long-term value,
                  strong appeal, and a premium residential experience.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="bestcity-product-footer">
        <div className="bestcity-product-container">
          <p>Contact: sales@bestcityhomes.com | (555) 987-2026</p>
        </div>
      </footer>
    </div>
  );
}
