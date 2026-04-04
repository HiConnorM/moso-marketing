"use client"

import { useEffect } from "react"
import Script from "next/script"

export default function Contact() {
  useEffect(() => {
    const pageWrapper = document.querySelector('.page-wrapper') as HTMLElement
    if (pageWrapper) {
      pageWrapper.style.opacity = '1'
    }
  }, [])

  return (
    <>
      <div style={{ opacity: 0 }} className="page-wrapper">
        <div id="top" className="top"></div>
        <div className="div-block-2">
          <nav className="navbar">
            <div className="navbar-glass-effect"></div>
            <div className="navbar-glass-tint"></div>
            <div className="navbar-glass-shine"></div>
            <div data-animation="default" data-collapse="tiny" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar-wrapper w-nav">
              <div className="navbar-container">
                <div className="navbar-logo-desktop">
                  <a href="/" className="navbar-logo-link w-nav-brand">
                    <img loading="lazy" height={200} alt="MOSO Logo" src="/images/OSO.svg" className="image-2" />
                  </a>
                </div>
                <div className="navbar-logo-mobile">
                  <a href="/" className="navbar-logo-link w-nav-brand">
                    <img loading="lazy" height="auto" alt="MOSO Logo" src="/images/OSO-4.png" className="image-2" />
                  </a>
                </div>
                <nav role="navigation" className="navbar-menu w-nav-menu">
                  <div className="navbar-menu-left">
                    <a href="/portfolio" className="navbar-link w-nav-link">Portfolio</a>
                    <a href="/services" className="navbar-link w-nav-link">Services</a>
                    <div data-delay="300" data-hover="false" className="menu-dropdown w-dropdown">
                      <div className="dropdown-toggle w-dropdown-toggle">
                        <div className="w-icon-dropdown-toggle"></div>
                        <div className="dropdown-title">Resources</div>
                      </div>
                      <nav className="dropdown-list w-dropdown-list">
                        <div className="dropdown-link-menu">
                          <a href="/blog" className="dropdown-link w-inline-block">
                            <div className="dropdown-links">Blog</div>
                          </a>
                        </div>
                      </nav>
                    </div>
                    <a href="/contact" aria-current="page" className="navbar-link w-nav-link w--current">Contact</a>
                  </div>
                  <div className="navbar-menu-right">
                    <div className="navbar-button-wrapper">
                      <a href="/contact" className="button white w-inline-block">
                        <div className="button-container">
                          <div className="overflow-hidden">
                            <div className="button-inner">
                              <div className="button-icon-back"><img src="/images/OSO.jpg" loading="lazy" alt="" /></div>
                              <div className="button-text-wrapper">
                                <div className="button-text-front">Get started</div>
                                <div aria-hidden="true" className="button-text-back">Get started</div>
                              </div>
                              <div className="button-icon-front"><img src="/images/OSO.jpg" loading="lazy" alt="" /></div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </nav>
                <div className="navbar-menu-button w-nav-button">
                  <div className="menu-icon-component">
                    <div className="menu-icon-line-top"></div>
                    <div className="menu-icon-line-middle"><div className="menu-icon-middle-line"></div></div>
                    <div className="menu-icon-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Contact Header */}
        <section className="section-page-header contact-header">
          <div className="page-header-background">
            <img src="/images/15507484.jpg" loading="eager" alt="" className="page-header-background-image" />
          </div>
          <div className="w-layout-blockcontainer container w-container">
            <div className="page-header-content">
              <div className="page-header-title">
                <h1 className="page-header-heading">Get in Touch</h1>
              </div>
              <div className="page-header-description">
                <p className="paragraph-large">Have a project in mind? We&apos;d love to hear from you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="w-layout-grid grid-12-columns">
              <div className="contact-info">
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <img src="/images/mail.svg" loading="lazy" alt="" />
                  </div>
                  <div className="contact-info-content">
                    <h4 className="contact-info-title">Email</h4>
                    <a href="mailto:hello@moso.marketing" className="contact-info-link">hello@moso.marketing</a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <img src="/images/smartphone.svg" loading="lazy" alt="" />
                  </div>
                  <div className="contact-info-content">
                    <h4 className="contact-info-title">Phone</h4>
                    <a href="tel:+1234567890" className="contact-info-link">+1 (234) 567-890</a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <img src="/images/map-pin.svg" loading="lazy" alt="" />
                  </div>
                  <div className="contact-info-content">
                    <h4 className="contact-info-title">Location</h4>
                    <p className="contact-info-text">Louisiana, USA</p>
                  </div>
                </div>
              </div>
              <div className="contact-form-wrapper">
                <div className="contact-form-block w-form">
                  <form id="contact-form" name="contact-form" className="contact-form">
                    <div className="form-field-wrapper">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input type="text" className="form-input w-input" maxLength={256} name="name" placeholder="Your name" id="name" required />
                    </div>
                    <div className="form-field-wrapper">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input type="email" className="form-input w-input" maxLength={256} name="email" placeholder="Your email" id="email" required />
                    </div>
                    <div className="form-field-wrapper">
                      <label htmlFor="message" className="form-label">Message</label>
                      <textarea id="message" name="message" maxLength={5000} placeholder="Tell us about your project" className="form-textarea w-input" required></textarea>
                    </div>
                    <button type="submit" className="button form-button w-button">Send Message</button>
                  </form>
                  <div className="form-success w-form-done">
                    <div>Thank you! Your submission has been received!</div>
                  </div>
                  <div className="form-error w-form-fail">
                    <div>Oops! Something went wrong while submitting the form.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="footer">
          <div className="footer-rows">
            <div className="footer-row-top">
              <div className="w-layout-blockcontainer container-fluid w-container">
                <div className="w-layout-grid grid-12-columns-small">
                  <div className="footer-widget">
                    <div className="margin-bottom-extra-small"><div>Have a project in mind?</div></div>
                    <a href="/contact" className="button white small w-inline-block">
                      <div className="button-container small">
                        <div className="overflow-hidden">
                          <div className="button-text-wrapper">
                            <div className="button-text-front">Let&apos;s Talk</div>
                            <div aria-hidden="true" className="button-text-back">Let&apos;s Talk</div>
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
                          <div className="back-top-icon-front"><img src="/images/arrow-up.svg" loading="lazy" alt="" className="back-top-icon-image" /></div>
                          <div className="back-top-icon-back"><img src="/images/arrow-up.svg" loading="lazy" alt="" className="back-top-icon-image" /></div>
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
                  <div className="footer-circle-backgound"><div className="footer-circle-border"></div></div>
                  <img src="/images/footer-circle-text.svg" loading="lazy" alt="Let's talk!" className="footer-circle-image" />
                  <div className="footer-circle-icon-wrapper">
                    <div className="footer-circle-icon-front"><img src="/images/OSO-4.png" loading="lazy" alt="" className="footer-circle-image" /></div>
                    <div className="footer-circle-icon-back"><img src="/images/OSO-4.png" loading="lazy" alt="" className="footer-circle-image" /></div>
                  </div>
                </a>
              </div>
            </div>
            <div className="footer-row-bottom"></div>
          </div>
        </section>
      </div>

      <Script src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=67ea24be240797066a84755c" strategy="beforeInteractive" />
      <Script src="/js/webflow.js" strategy="afterInteractive" />
    </>
  )
}
