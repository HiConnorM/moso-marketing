"use client"

interface NavbarProps {
  currentPage?: string
}

export default function Navbar({ currentPage }: NavbarProps) {
  return (
    <div className="div-block-2">
      <nav className="navbar">
        <div className="navbar-glass-effect"></div>
        <div className="navbar-glass-tint"></div>
        <div className="navbar-glass-shine"></div>
        <div className="navbar-glass-filter w-embed">
          <svg style={{ display: "none" }}>
            <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
              <feTurbulence type="fractalNoise" baseFrequency="0.015 0.015" numOctaves={1} seed={5} result="turbulence" />
            </filter>
          </svg>
        </div>
        <div data-animation="default" data-collapse="tiny" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar-wrapper w-nav">
          <div className="navbar-container">
            <div className="navbar-logo-desktop">
              <a href="/" className="navbar-logo-link w-nav-brand">
                <img loading="lazy" height={200} alt="MOSO Logo" src="/images/moso-logo-color.svg" className="image-2" />
              </a>
            </div>
            <div className="navbar-logo-mobile">
              <a href="/" className="navbar-logo-link w-nav-brand">
                <img loading="lazy" height="auto" alt="MOSO Logo" src="/images/moso-circle-white.svg" className="image-2" />
              </a>
            </div>
            <nav role="navigation" className="navbar-menu w-nav-menu">
              <div className="navbar-menu-left">
                <a href="/portfolio" className={`navbar-link w-nav-link ${currentPage === 'portfolio' ? 'w--current' : ''}`}>Portfolio</a>
                <a href="/services" className={`navbar-link w-nav-link ${currentPage === 'services' ? 'w--current' : ''}`}>Services</a>
                <div data-delay="300" data-hover="false" className="menu-dropdown w-dropdown">
                  <div className="dropdown-toggle w-dropdown-toggle">
                    <div className="w-icon-dropdown-toggle"></div>
                    <div className="dropdown-title">Resources</div>
                  </div>
                  <nav className="dropdown-list w-dropdown-list">
                    <div className="dropdown-link-menu">
                      <a href="/blog" className={`dropdown-link w-inline-block ${currentPage === 'blog' ? 'w--current' : ''}`}>
                        <div className="dropdown-links">Blog</div>
                      </a>
                      <a href="/free-audit" className={`dropdown-link w-inline-block ${currentPage === 'free-audit' ? 'w--current' : ''}`}>
                        <div className="dropdown-links">Free Website Audit</div>
                      </a>
                      <a href="#" className="dropdown-link w-inline-block">
                        <div className="dropdown-links">Learning Hub</div>
                      </a>
                      <a href="#" className="dropdown-link w-inline-block">
                        <div className="dropdown-links">Events</div>
                      </a>
                      <a href="#" className="dropdown-link w-inline-block">
                        <div className="dropdown-links">Newsletter</div>
                      </a>
                      <a href="#" className="dropdown-link w-inline-block">
                        <div className="dropdown-links">Careers</div>
                      </a>
                    </div>
                  </nav>
                </div>
                <a href="/contact" className={`navbar-link w-nav-link ${currentPage === 'contact' ? 'w--current' : ''}`}>Contact</a>
              </div>
              <div className="navbar-menu-right">
                <div className="navbar-button-wrapper">
                  <a href="/contact" className="button white w-inline-block">
                    <div className="button-container">
                      <div className="overflow-hidden">
                        <div className="button-inner">
                          <div className="button-icon-back">
                            <img src="/images/OSO.png" loading="lazy" alt="" />
                          </div>
                          <div className="button-text-wrapper">
                            <div className="button-text-front">Get started</div>
                            <div aria-hidden="true" className="button-text-back">Get started</div>
                          </div>
                          <div className="button-icon-front">
                            <img src="/images/OSO.png" loading="lazy" alt="" />
                          </div>
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
                <div className="menu-icon-line-middle">
                  <div className="menu-icon-middle-line"></div>
                </div>
                <div className="menu-icon-2"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
