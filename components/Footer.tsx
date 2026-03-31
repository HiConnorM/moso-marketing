"use client"

export default function Footer() {
  return (
    <section className="footer">
      <div className="footer-rows">
        <div className="footer-row-top">
          <div className="w-layout-blockcontainer container-fluid w-container">
            <div className="w-layout-grid grid-12-columns-small">
              <div className="footer-widget">
                <div className="margin-bottom-extra-small">
                  <div>Have a project in mind?</div>
                </div>
                <a href="/contact" className="button white small w-inline-block">
                  <div className="button-container small">
                    <div className="overflow-hidden">
                      <div className="button-text-wrapper">
                        <div className="button-text-front">{"Let's Talk"}</div>
                        <div aria-hidden="true" className="button-text-back">{"Let's Talk"}</div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              <div>
                <div className="w-layout-grid grid-12-columns-zero">
                  <div className="footer-widget">
                    <div className="footer-links-wrapper">
                      <a href="#" target="_blank" className="footer-link w-inline-block">
                        <div className="footer-link-inner">
                          <div className="footer-link-front"><div>Facebook</div></div>
                          <div className="footer-link-back"><div>Facebook</div></div>
                        </div>
                      </a>
                      <a href="#" target="_blank" className="footer-link w-inline-block">
                        <div className="footer-link-inner">
                          <div className="footer-link-front"><div>Instagram</div></div>
                          <div className="footer-link-back"><div>Instagram</div></div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="footer-widget">
                    <div className="footer-links-wrapper">
                      <a href="#" target="_blank" className="footer-link w-inline-block">
                        <div className="footer-link-inner">
                          <div className="footer-link-front"><div>TikTok</div></div>
                          <div className="footer-link-back"><div>TikTok</div></div>
                        </div>
                      </a>
                      <a href="#" target="_blank" className="footer-link w-inline-block">
                        <div className="footer-link-inner">
                          <div className="footer-link-front"><div>LinkedIn</div></div>
                          <div className="footer-link-back"><div>LinkedIn</div></div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-widget align-right">
                <a href="#top" className="back-top-link w-inline-block">
                  <div className="back-top-icon">
                    <div className="back-top-icon-inner">
                      <div className="back-top-icon-front">
                        <img src="/images/arrow-up.svg" loading="lazy" alt="" className="back-top-icon-image" />
                      </div>
                      <div className="back-top-icon-back">
                        <img src="/images/arrow-up.svg" loading="lazy" alt="" className="back-top-icon-image" />
                      </div>
                    </div>
                  </div>
                  <div className="back-top-text">Back to top</div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-row-middle">
          <div className="overflow-hidden">
            <div className="marquee">
              <div className="marquee-track gutter-large">
                <div className="marquee-item"><h2 className="footer-heading">MOSO</h2></div>
                <div aria-hidden="true" className="marquee-item"><div className="footer-heading">MOSO</div></div>
                <div aria-hidden="true" className="marquee-item"><div className="footer-heading">MOSO</div></div>
                <div aria-hidden="true" className="marquee-item"><div className="footer-heading">MOSO</div></div>
              </div>
            </div>
            <div className="marquee reverse">
              <div className="marquee-track-reverse gutter-large">
                <div className="marquee-item margin-left"><h2 className="footer-heading">AGENCY</h2></div>
                <div aria-hidden="true" className="marquee-item margin-left"><div className="footer-heading">AGENCY</div></div>
                <div aria-hidden="true" className="marquee-item margin-left"><div className="footer-heading">AGENCY</div></div>
                <div aria-hidden="true" className="marquee-item margin-left"><div className="footer-heading">AGENCY</div></div>
              </div>
            </div>
          </div>
          <div className="footer-circle-wrapper">
            <a href="/contact" className="footer-circle-link w-inline-block">
              <div className="footer-circle-backgound">
                <div className="footer-circle-border"></div>
              </div>
              <img src="/images/footer-circle-text.svg" loading="lazy" alt="Let's talk!" className="footer-circle-image" />
              <div className="footer-circle-icon-wrapper">
                <div className="footer-circle-icon-front">
                  <img src="/images/OSO-4.png" loading="lazy" alt="" className="footer-circle-image" />
                </div>
                <div className="footer-circle-icon-back">
                  <img src="/images/OSO-4.png" loading="lazy" alt="" className="footer-circle-image" />
                </div>
              </div>
            </a>
          </div>
        </div>
        <div className="footer-row-bottom"></div>
      </div>
    </section>
  )
}
