"use client"

import { useEffect } from "react"
import Script from "next/script"

export default function Home() {
  useEffect(() => {
    // Initialize page wrapper opacity
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
                    <img loading="lazy" height={200} alt="MOSO Logo" src="/images/OSO.svg" className="image-2" />
                  </a>
                </div>
                <div className="navbar-logo-mobile">
                  <a href="/" className="navbar-logo-link w-nav-brand">
                    <img loading="lazy" height="auto" alt="MOSO Logo" src="/images/OSO-4.jpg" className="image-2" />
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
                    <a href="/contact" className="navbar-link w-nav-link">Contact</a>
                  </div>
                  <div className="navbar-menu-right">
                    <div className="navbar-button-wrapper">
                      <a href="/contact" className="button white w-inline-block">
                        <div className="button-container">
                          <div className="overflow-hidden">
                            <div className="button-inner">
                              <div className="button-icon-back">
                                <img src="/images/OSO.jpg" loading="lazy" alt="" />
                              </div>
                              <div className="button-text-wrapper">
                                <div className="button-text-front">Get started</div>
                                <div aria-hidden="true" className="button-text-back">Get started</div>
                              </div>
                              <div className="button-icon-front">
                                <img src="/images/OSO.jpg" loading="lazy" alt="" />
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

        {/* Hero Section */}
        <section className="section-hero">
          <div className="hero-content-top">
            <div className="container-fluid">
              <div className="heading-rotation-wrapper">
                <div className="heading-word-first">
                  <div className="hero-heading hero-heading-three">
                    <div className="hero-heading-front">
                      <h1 className="hero-title">DESIGN </h1>
                    </div>
                    <div aria-hidden="true" className="hero-heading-back">
                      <div className="hero-title">DESIGN </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="heading-rotation-wrapper">
                <div className="heading-word-first">
                  <div className="hero-heading hero-heading-three">
                    <div className="hero-heading-front">
                      <h1 className="hero-title">your</h1>
                    </div>
                    <div aria-hidden="true" className="hero-heading-back">
                      <div className="hero-title">your</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="heading-rotation-wrapper">
                <div className="heading-word-second">
                  <div className="heading-rotation-delay">
                    <div className="hero-heading-front">
                      <h2 className="hero-title">Future</h2>
                    </div>
                    <div aria-hidden="true" className="hero-heading-back">
                      <div className="hero-title">Future</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-content-bottom">
            <div className="w-layout-blockcontainer container-fluid w-container">
              <div className="w-layout-grid grid-12-columns-small">
                <div className="hero-services-container">
                  <div className="opacity-80">
                    <div className="hero-caption-wrapper">
                      <h2 className="caption">What we do</h2>
                      <img src="/images/long-arrow-right-down.svg" loading="lazy" alt="" className="caption-icon" />
                    </div>
                    <div className="hero-services">
                      <div className="hero-service-item">
                        <div className="divider-top">
                          <div className="divider white"></div>
                        </div>
                        <div className="hero-service-text">Branding</div>
                        <div className="hero-service-number">01</div>
                        <div className="divider-bottom">
                          <div className="divider white"></div>
                        </div>
                      </div>
                      <div className="hero-service-item">
                        <div className="hero-service-text">Design</div>
                        <div className="hero-service-number">02</div>
                        <div className="divider-bottom">
                          <div className="divider white"></div>
                        </div>
                      </div>
                      <div className="hero-service-item">
                        <div className="hero-service-text">Development</div>
                        <div className="hero-service-number">03</div>
                        <div className="divider-bottom">
                          <div className="divider white"></div>
                        </div>
                      </div>
                      <div className="hero-service-item">
                        <div className="hero-service-text">MARKETING</div>
                        <div className="hero-service-number">04</div>
                        <div className="divider-bottom">
                          <div className="divider white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hero-text-wrapper-copy">
                  <div className="hero-text-container">
                    <div className="opacity-80">
                      <div className="margin-bottom-small">
                        <p className="paragraph-small">
                          MOSO is a full-service Brand AND DEVELOPMENT studio creating beautiful digital experiences and products. we take a sustainable approach to growth, ensuring businesses are positioned for long-term success, not just quick wins.
                        </p>
                      </div>
                      <a href="/portfolio" className="button white w-inline-block">
                        <div className="button-container">
                          <div className="overflow-hidden">
                            <div className="button-inner">
                              <div className="button-icon-back">
                                <img src="/images/OSO.jpg" loading="lazy" alt="" />
                              </div>
                              <div className="button-text-wrapper">
                                <div className="button-text-front">View Our Works</div>
                                <div aria-hidden="true" className="button-text-back">View Our Works</div>
                              </div>
                              <div className="button-icon-front">
                                <img src="/images/OSO.jpg" loading="lazy" alt="" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-image-inner">
              <img src="/images/hero-work-2.jpg" loading="eager" alt="Beautiful design showcase" className="hero-image" />
              <img src="/images/hero-mobile.jpg" loading="eager" alt="Mobile design showcase" className="hero-image-mobile" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="w-layout-grid grid-12-columns">
              <div className="about-section-content">
                <div className="has-title-vertical">
                  <div className="title-vertical-wrapper">
                    <div className="number-vertical">
                      <div className="number-vertical-inner">
                        <div className="section-title-text">(01)</div>
                      </div>
                    </div>
                    <div className="title-vertical">
                      <h2 className="section-title-text">About us</h2>
                    </div>
                    <div className="divider-vertical"></div>
                  </div>
                  <div className="about-section-content-inner">
                    <div className="margin-bottom-medium">
                      <h3 className="heading-small">Crafting ideas<br />that inspire</h3>
                    </div>
                    <div className="about-section-bottom">
                      <div className="margin-bottom-medium">
                        <p className="paragraph-large">
                          We are a creative studio that loves making beautiful websites and premium products. We&apos;ve won some awards for our work. We&apos;re really good at creating brands, designing cool stuff, and making things work just right. At our core, we believe in the power of simplicity and effectiveness.
                        </p>
                      </div>
                      <div>
                        <a href="/about" className="button w-inline-block">
                          <div className="button-container">
                            <div className="overflow-hidden">
                              <div className="button-inner">
                                <div className="button-icon-back">
                                  <img src="/images/OSO.jpg" loading="lazy" alt="" />
                                </div>
                                <div className="button-text-wrapper">
                                  <div className="button-text-front">More About Us</div>
                                  <div aria-hidden="true" className="button-text-back">More About Us</div>
                                </div>
                                <div className="button-icon-front">
                                  <img src="/images/OSO.jpg" loading="lazy" alt="" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="about-image-wrapper">
                <div className="about-image-inner">
                  <div className="div-block-3">
                    <div className="iphone">
                      <div className="iphone-wrapper">
                        <img width={100} height="auto" alt="" src="/images/about.jpg" loading="lazy" className="iphone-image" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="w-layout-grid grid-12-columns">
              <div className="mission-title-wrapper">
                <div className="section-title">
                  <h2 className="section-title-text">Our Mission</h2>
                  <div className="section-title-text">(02)</div>
                  <div className="divider-bottom">
                    <div className="divider"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="w-layout-blockcontainer container-fluid w-container">
              <div className="mission-heading-wrapper">
                <div className="heading-rotation">
                  <div className="heading-rotation-front">
                    <h3 className="heading-large">Evolution</h3>
                  </div>
                  <div aria-hidden="true" className="heading-rotation-back">
                    <div className="heading-large">Evolution</div>
                  </div>
                </div>
                <div className="mission-heading-number">001</div>
              </div>
              <div className="align-right">
                <div className="mission-heading-wrapper">
                  <div className="mission-heading-number left">002</div>
                  <div className="heading-rotation">
                    <div className="heading-rotation-front">
                      <h3 className="heading-large">Through</h3>
                    </div>
                    <div aria-hidden="true" className="heading-rotation-back">
                      <div className="heading-large">Through</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="align-center">
                <div className="mission-heading-wrapper margin-left">
                  <div className="heading-rotation">
                    <div className="heading-rotation-front">
                      <h3 className="heading-large">Design</h3>
                    </div>
                    <div aria-hidden="true" className="heading-rotation-back">
                      <div className="heading-large">Design</div>
                    </div>
                  </div>
                  <div className="mission-heading-number">003</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-layout-blockcontainer container w-container">
            <div className="w-layout-grid grid-12-columns-small">
              <div className="mission-image-wrapper">
                <div className="mission-image">
                  <div className="image-placeholder"></div>
                  <img src="/images/_.jpg" loading="lazy" alt="" className="image-cover" />
                </div>
              </div>
              <div className="mission-text">
                <p className="paragraph-small">
                  We thrive on turning imaginative concepts into user-friendly digital solutions. Whether it&apos;s a sleek website, a user-friendly app, or a memorable brand identity, we focus on creating designs that not only look great but also resonate with your audience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section">
          <div className="split-section">
            <div className="split-image-wrapper">
              <img src="/images/IMG_4332.jpg" loading="lazy" alt="" className="split-image" />
            </div>
            <div className="split-background"></div>
            <div className="split-content">
              <div className="section-title">
                <h2 className="section-title-text">Services</h2>
                <div className="section-title-text">(03)</div>
                <div className="divider-bottom">
                  <div className="divider white"></div>
                </div>
              </div>
              <div className="split-section-top">
                <div className="margin-bottom-medium">
                  {/* Branding Accordion */}
                  <div data-hover="false" data-delay="750" className="accordion-item w-dropdown">
                    <div className="accordion-toggle w-dropdown-toggle">
                      <h3 className="accordion-title">Branding</h3>
                      <div className="accordion-icon">
                        <div className="accordion-plus">
                          <div className="accordin-plus-line-v"></div>
                          <div className="accordin-plus-line-h"></div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-content w-dropdown-list">
                      <div className="accordion-content-inner">
                        <div className="w-layout-grid grid-12-columns-small">
                          <div>
                            <p className="paragraph-small no-text-indent">We craft compelling brand identities that resonate with your audience and leave a lasting impression. From logo design to comprehensive brand strategies, we help you define who you are and stand out in a crowded market.</p>
                          </div>
                          <div className="icons-list">
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Brand Strategy</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Logo Design</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Brand Guidelines</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Rebranding</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Packaging Design</div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Design Accordion */}
                  <div data-hover="false" data-delay="750" className="accordion-item w-dropdown">
                    <div className="accordion-toggle w-dropdown-toggle">
                      <h3 className="accordion-title">Design</h3>
                      <div className="accordion-icon">
                        <div className="accordion-plus">
                          <div className="accordin-plus-line-v"></div>
                          <div className="accordin-plus-line-h"></div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-content w-dropdown-list">
                      <div className="accordion-content-inner">
                        <div className="w-layout-grid grid-12-columns-small">
                          <div>
                            <p className="paragraph-small no-text-indent">Our design services bring creativity and function together, delivering user-friendly experiences and products. Whether it&apos;s graphic design, UI/UX, or motion graphics, we shape ideas into designs that captivate and engage.</p>
                          </div>
                          <div className="icons-list">
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Graphic Design</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">UI/UX Design</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Motion Design</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Print Design</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Environmental Design</div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Development Accordion */}
                  <div data-hover="false" data-delay="750" className="accordion-item w-dropdown">
                    <div className="accordion-toggle w-dropdown-toggle">
                      <h3 className="accordion-title">Development</h3>
                      <div className="accordion-icon">
                        <div className="accordion-plus">
                          <div className="accordin-plus-line-v"></div>
                          <div className="accordin-plus-line-h"></div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-content w-dropdown-list">
                      <div className="accordion-content-inner">
                        <div className="w-layout-grid grid-12-columns-small">
                          <div>
                            <p className="paragraph-small no-text-indent">From robust websites to cutting-edge web applications, our development team builds fast, secure, and scalable digital solutions tailored to your needs. We transform designs into online experiences that deliver results.</p>
                          </div>
                          <div className="icons-list">
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Front-End</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Back-End</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">E-Commerce</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">CMS Development</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Web Applications</div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Advertising Accordion */}
                  <div data-hover="false" data-delay="750" className="accordion-item w-dropdown">
                    <div className="accordion-toggle w-dropdown-toggle">
                      <h3 className="accordion-title">ADVERTISING</h3>
                      <div className="accordion-icon">
                        <div className="accordion-plus">
                          <div className="accordin-plus-line-v"></div>
                          <div className="accordin-plus-line-h"></div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-content w-dropdown-list">
                      <div className="accordion-content-inner">
                        <div className="w-layout-grid grid-12-columns-small">
                          <div>
                            <p className="paragraph-small no-text-indent">Our photography captures the essence of your brand with stunning visuals that tell your story. From product shoots to lifestyle and editorial photography, we create images that inspire and connect with your audience.</p>
                          </div>
                          <div className="icons-list">
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Product Photography</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Portrait Photography</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Event Photography</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Editorial Photography</div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Marketing Accordion */}
                  <div data-hover="false" data-delay="750" className="accordion-item w-dropdown">
                    <div className="accordion-toggle w-dropdown-toggle">
                      <h3 className="accordion-title">Marketing</h3>
                      <div className="accordion-icon">
                        <div className="accordion-plus">
                          <div className="accordin-plus-line-v"></div>
                          <div className="accordin-plus-line-h"></div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-content w-dropdown-list">
                      <div className="accordion-content-inner">
                        <div className="w-layout-grid grid-12-columns-small">
                          <div>
                            <p className="paragraph-small no-text-indent">Our marketing strategies amplify your message and drive measurable growth. Through targeted campaigns, social media, SEO, and content marketing, we ensure your brand reaches the right people, at the right time, in the right way.</p>
                          </div>
                          <div className="icons-list">
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Digital Marketing</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Search Engines</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Social Media</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Paid Advertising</div></div>
                            <div className="icons-list-item"><img src="/images/check-white.svg" loading="lazy" alt="" className="icons-list-image" /><div className="icons-list-text">Email Marketing</div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="split-content-bottom">
                <a href="/services" className="button white w-inline-block">
                  <div className="button-container">
                    <div className="overflow-hidden">
                      <div className="button-inner">
                        <div className="button-icon-back">
                          <img src="/images/OSO.jpg" loading="lazy" alt="" />
                        </div>
                        <div className="button-text-wrapper">
                          <div className="button-text-front">View our services</div>
                          <div aria-hidden="true" className="button-text-back">View our services</div>
                        </div>
                        <div className="button-icon-front">
                          <img src="/images/OSO.jpg" loading="lazy" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="section">
          <div className="w-layout-blockcontainer container-fluid w-container">
            <div className="section-title">
              <h2 className="section-title-text">Portfolio</h2>
              <div className="section-title-text">(04)</div>
              <div className="divider-bottom">
                <div className="divider"></div>
              </div>
            </div>
            <div className="w-layout-grid grid-12-columns-small">
              <div>
                <h3 className="heading-medium">Selected<br />Work</h3>
              </div>
              <div className="section-header-caption">
                <div className="container-extra-small right">
                  <div className="caption">Projects of years<br />©2021 — 2025</div>
                </div>
              </div>
            </div>
            <div data-current="Tab 1" data-easing="ease" data-duration-in="120" data-duration-out="120" className="portfolio-tabs w-tabs">
              <div className="portfolio-tabs-menu w-tab-menu">
                <a data-w-tab="Tab 1" className="portfolio-tab-link first w-inline-block w-tab-link w--current">
                  <div className="portfolio-tab-active">
                    <div className="portfolio-tab-active-background"></div>
                  </div>
                  <div className="portfolio-tab-text">Grid</div>
                </a>
                <a data-w-tab="Tab 2" className="portfolio-tab-link second w-inline-block w-tab-link">
                  <div>List</div>
                </a>
              </div>
              <div className="tabs-content w-tab-content">
                <div data-w-tab="Tab 1" className="portfolio-tab-pane w-tab-pane w--tab-active">
                  <div className="portfolio-tab-inner">
                    <div className="margin-bottom-large">
                      <div role="list" className="projects-grid">
                        <div role="listitem" className="project-item">
                          <a href="/portfolio" className="project-link w-inline-block">
                            <img loading="lazy" src="/images/hero-work-1.jpg" alt="Blue Sky Project" className="project-thumbnail" />
                            <div className="project-content">
                              <div className="project-content-header">
                                <div className="project-title-wrapper">
                                  <div className="project-title-front">
                                    <h4 className="project-title">Blue Sky</h4>
                                  </div>
                                  <div aria-hidden="true" className="project-title-back">
                                    <div className="project-title">Blue Sky</div>
                                  </div>
                                </div>
                                <div className="project-arrow">
                                  <div className="project-arrow-inner">
                                    <div className="project-arrow-front"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="project-arrow-image" /></div>
                                    <div className="project-arrow-back"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="project-arrow-image" /></div>
                                  </div>
                                </div>
                              </div>
                              <div className="project-content-footer">
                                <div className="project-label"><div className="project-label-text">Branding</div></div>
                                <div className="project-label"><div className="project-label-text">Design</div></div>
                              </div>
                            </div>
                          </a>
                        </div>
                        <div role="listitem" className="project-item">
                          <a href="/portfolio" className="project-link w-inline-block">
                            <img loading="lazy" src="/images/hero-work-2.jpg" alt="George's Project" className="project-thumbnail" />
                            <div className="project-content">
                              <div className="project-content-header">
                                <div className="project-title-wrapper">
                                  <div className="project-title-front">
                                    <h4 className="project-title">George&apos;s</h4>
                                  </div>
                                  <div aria-hidden="true" className="project-title-back">
                                    <div className="project-title">George&apos;s</div>
                                  </div>
                                </div>
                                <div className="project-arrow">
                                  <div className="project-arrow-inner">
                                    <div className="project-arrow-front"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="project-arrow-image" /></div>
                                    <div className="project-arrow-back"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="project-arrow-image" /></div>
                                  </div>
                                </div>
                              </div>
                              <div className="project-content-footer">
                                <div className="project-label"><div className="project-label-text">Development</div></div>
                                <div className="project-label"><div className="project-label-text">Branding</div></div>
                              </div>
                            </div>
                          </a>
                        </div>
                        <div role="listitem" className="project-item">
                          <a href="/portfolio" className="project-link w-inline-block">
                            <img loading="lazy" src="/images/hero-work-3.jpg" alt="Tower Hotel Project" className="project-thumbnail" />
                            <div className="project-content">
                              <div className="project-content-header">
                                <div className="project-title-wrapper">
                                  <div className="project-title-front">
                                    <h4 className="project-title">Tower Hotel</h4>
                                  </div>
                                  <div aria-hidden="true" className="project-title-back">
                                    <div className="project-title">Tower Hotel</div>
                                  </div>
                                </div>
                                <div className="project-arrow">
                                  <div className="project-arrow-inner">
                                    <div className="project-arrow-front"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="project-arrow-image" /></div>
                                    <div className="project-arrow-back"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="project-arrow-image" /></div>
                                  </div>
                                </div>
                              </div>
                              <div className="project-content-footer">
                                <div className="project-label"><div className="project-label-text">Branding</div></div>
                                <div className="project-label"><div className="project-label-text">Development</div></div>
                              </div>
                            </div>
                          </a>
                        </div>
                        <div role="listitem" className="project-item">
                          <a href="/portfolio" className="project-link w-inline-block">
                            <img loading="lazy" src="/images/about.jpg" alt="Pixel Playground Project" className="project-thumbnail" />
                            <div className="project-content">
                              <div className="project-content-header">
                                <div className="project-title-wrapper">
                                  <div className="project-title-front">
                                    <h4 className="project-title">Pixel Playground</h4>
                                  </div>
                                  <div aria-hidden="true" className="project-title-back">
                                    <div className="project-title">Pixel Playground</div>
                                  </div>
                                </div>
                                <div className="project-arrow">
                                  <div className="project-arrow-inner">
                                    <div className="project-arrow-front"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="project-arrow-image" /></div>
                                    <div className="project-arrow-back"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="project-arrow-image" /></div>
                                  </div>
                                </div>
                              </div>
                              <div className="project-content-footer">
                                <div className="project-label"><div className="project-label-text">Branding</div></div>
                                <div className="project-label"><div className="project-label-text">Design</div></div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="w-layout-grid grid-12-columns-fixed-gap">
                      <div className="container-small">
                        <div className="margin-bottom-small">
                          <p className="paragraph-small">Discover how our creativity transforms ideas into impactful digital experiences — explore more of our projects.</p>
                        </div>
                        <a href="/portfolio" className="button w-inline-block">
                          <div className="button-container">
                            <div className="overflow-hidden">
                              <div className="button-inner">
                                <div className="button-icon-back"><img src="/images/OSO.jpg" loading="lazy" alt="" /></div>
                                <div className="button-text-wrapper">
                                  <div className="button-text-front">View all projects</div>
                                  <div aria-hidden="true" className="button-text-back">View all projects</div>
                                </div>
                                <div className="button-icon-front"><img src="/images/OSO.jpg" loading="lazy" alt="" /></div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-w-tab="Tab 2" className="portfolio-tab-pane w-tab-pane">
                  <div className="portfolio-tab-inner">
                    <div className="margin-bottom-large">
                      <div className="position-relative">
                        <div className="w-layout-grid grid-12-columns-small">
                          <div>
                            <div className="projects-list-image-wrapper">
                              <div className="projects-list-image-inner"><img loading="lazy" src="/images/projects-list.jpg" alt="Project showcase" className="projects-list-image" /></div>
                            </div>
                            <div role="list" className="projects-list">
                              <div role="listitem" className="projects-list-item">
                                <a href="/portfolio" className="projects-list-link w-inline-block">
                                  <div className="divider"></div>
                                  <div className="projects-list-inner">
                                    <div className="w-layout-grid projects-list-columns">
                                      <div className="projects-list-column-first">
                                        <h4 className="projects-list-title">Blue Sky</h4>
                                      </div>
                                      <div className="projects-list-text">
                                        <div className="projects-list-categories">
                                          <div>Branding</div>
                                          <div className="projects-list-comma">,</div>
                                          <div>Design</div>
                                          <div className="projects-list-comma">,</div>
                                        </div>
                                      </div>
                                      <div className="projects-list-column-last">
                                        <div className="projects-list-arrow"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="projects-list-arrow-black" /><img loading="lazy" src="/images/arrow-up-right-white.svg" alt="" className="projects-list-arrow-white" /></div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="projects-list-hover"></div>
                                </a>
                              </div>
                              <div role="listitem" className="projects-list-item">
                                <a href="/portfolio" className="projects-list-link w-inline-block">
                                  <div className="divider"></div>
                                  <div className="projects-list-inner">
                                    <div className="w-layout-grid projects-list-columns">
                                      <div className="projects-list-column-first">
                                        <h4 className="projects-list-title">George&apos;s</h4>
                                      </div>
                                      <div className="projects-list-text">
                                        <div className="projects-list-categories">
                                          <div>Development</div>
                                          <div className="projects-list-comma">,</div>
                                          <div>Branding</div>
                                          <div className="projects-list-comma">,</div>
                                        </div>
                                      </div>
                                      <div className="projects-list-column-last">
                                        <div className="projects-list-arrow"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="projects-list-arrow-black" /><img loading="lazy" src="/images/arrow-up-right-white.svg" alt="" className="projects-list-arrow-white" /></div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="projects-list-hover"></div>
                                </a>
                              </div>
                              <div role="listitem" className="projects-list-item">
                                <a href="/portfolio" className="projects-list-link w-inline-block">
                                  <div className="divider"></div>
                                  <div className="projects-list-inner">
                                    <div className="w-layout-grid projects-list-columns">
                                      <div className="projects-list-column-first">
                                        <h4 className="projects-list-title">Tower Hotel</h4>
                                      </div>
                                      <div className="projects-list-text">
                                        <div className="projects-list-categories">
                                          <div>Branding</div>
                                          <div className="projects-list-comma">,</div>
                                          <div>Development</div>
                                          <div className="projects-list-comma">,</div>
                                        </div>
                                      </div>
                                      <div className="projects-list-column-last">
                                        <div className="projects-list-arrow"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="projects-list-arrow-black" /><img loading="lazy" src="/images/arrow-up-right-white.svg" alt="" className="projects-list-arrow-white" /></div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="projects-list-hover"></div>
                                </a>
                              </div>
                              <div role="listitem" className="projects-list-item">
                                <a href="/portfolio" className="projects-list-link w-inline-block">
                                  <div className="divider"></div>
                                  <div className="projects-list-inner">
                                    <div className="w-layout-grid projects-list-columns">
                                      <div className="projects-list-column-first">
                                        <h4 className="projects-list-title">Pixel Playground</h4>
                                      </div>
                                      <div className="projects-list-text">
                                        <div className="projects-list-categories">
                                          <div>Branding</div>
                                          <div className="projects-list-comma">,</div>
                                          <div>Design</div>
                                          <div className="projects-list-comma">,</div>
                                        </div>
                                      </div>
                                      <div className="projects-list-column-last">
                                        <div className="projects-list-arrow"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="projects-list-arrow-black" /><img loading="lazy" src="/images/arrow-up-right-white.svg" alt="" className="projects-list-arrow-white" /></div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="projects-list-hover"></div>
                                </a>
                              </div>
                              <div role="listitem" className="projects-list-item">
                                <a href="/portfolio" className="projects-list-link w-inline-block">
                                  <div className="divider"></div>
                                  <div className="projects-list-inner">
                                    <div className="w-layout-grid projects-list-columns">
                                      <div className="projects-list-column-first">
                                        <h4 className="projects-list-title">Medium Scene</h4>
                                      </div>
                                      <div className="projects-list-text">
                                        <div className="projects-list-categories">
                                          <div>Design</div>
                                          <div className="projects-list-comma">,</div>
                                          <div>Development</div>
                                          <div className="projects-list-comma">,</div>
                                        </div>
                                      </div>
                                      <div className="projects-list-column-last">
                                        <div className="projects-list-arrow"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="projects-list-arrow-black" /><img loading="lazy" src="/images/arrow-up-right-white.svg" alt="" className="projects-list-arrow-white" /></div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="projects-list-hover"></div>
                                </a>
                              </div>
                              <div role="listitem" className="projects-list-item">
                                <a href="/portfolio" className="projects-list-link w-inline-block">
                                  <div className="divider"></div>
                                  <div className="projects-list-inner">
                                    <div className="w-layout-grid projects-list-columns">
                                      <div className="projects-list-column-first">
                                        <h4 className="projects-list-title">Visual Symphony</h4>
                                      </div>
                                      <div className="projects-list-text">
                                        <div className="projects-list-categories">
                                          <div>Branding</div>
                                          <div className="projects-list-comma">,</div>
                                          <div>Development</div>
                                          <div className="projects-list-comma">,</div>
                                        </div>
                                      </div>
                                      <div className="projects-list-column-last">
                                        <div className="projects-list-arrow"><img loading="lazy" src="/images/arrow-up-right.svg" alt="" className="projects-list-arrow-black" /><img loading="lazy" src="/images/arrow-up-right-white.svg" alt="" className="projects-list-arrow-white" /></div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="projects-list-hover"></div>
                                </a>
                              </div>
                            </div>
                            <div className="divider"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-layout-grid grid-12-columns-small">
                      <div>
                        <div className="container-small">
                          <div className="margin-bottom-small">
                            <p className="paragraph-small">Discover how our creativity transforms ideas into impactful digital experiences — explore more of our projects.</p>
                          </div>
                          <a href="/portfolio" className="button w-inline-block">
                            <div className="button-container">
                              <div className="overflow-hidden">
                                <div className="button-inner">
                                  <div className="button-icon-back"><img src="/images/spark.svg" loading="lazy" alt="" /></div>
                                  <div className="button-text-wrapper">
                                    <div className="button-text-front">View all projects</div>
                                    <div aria-hidden="true" className="button-text-back">View all projects</div>
                                  </div>
                                  <div className="button-icon-front"><img src="/images/spark.svg" loading="lazy" alt="" /></div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="section">
          <div className="overflow-hidden">
            <div className="w-layout-blockcontainer container-fluid w-container">
              <div className="section-title">
                <h2 className="section-title-text">Blog</h2>
                <div className="section-title-text">(05)</div>
                <div className="divider-bottom">
                  <div className="divider"></div>
                </div>
              </div>
              <div className="w-layout-grid grid-12-columns-small">
                <div>
                  <h3 className="heading-medium">News /</h3>
                </div>
                <div className="section-header-caption">
                  <div className="container-extra-small right">
                    <p className="paragraph-small">Discover the inspiration with the latest trends, tips, and stories from the forefront of design and digital innovation.</p>
                    <a href="/blog" className="button w-inline-block">
                      <div className="button-container">
                        <div className="overflow-hidden">
                          <div className="button-inner">
                            <div className="button-icon-back"><img src="/images/OSO.jpg" loading="lazy" alt="" /></div>
                            <div className="button-text-wrapper">
                              <div className="button-text-front">View Our Blog</div>
                              <div aria-hidden="true" className="button-text-back">View Our Blog</div>
                            </div>
                            <div className="button-icon-front"><img src="/images/OSO.jpg" loading="lazy" alt="" /></div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="blog-grid">
                <a href="/blog" className="blog-link w-inline-block">
                  <div className="blog-thumbnail">
                    <img loading="lazy" alt="Blog post thumbnail" src="/images/service-1.jpg" className="blog-thumbnail-image" />
                  </div>
                  <div className="blog-item-intro">
                    <div className="blog-item-circle"></div>
                    <h4 className="blog-item-title">Brave is on the Quest for Exceptional Talent to Join Our Team</h4>
                    <div className="blog-item-date">December 1, 2025</div>
                  </div>
                </a>
                <a href="/blog" className="blog-link w-inline-block">
                  <div className="blog-thumbnail">
                    <img loading="lazy" alt="Blog post thumbnail" src="/images/service-2.jpg" className="blog-thumbnail-image" />
                  </div>
                  <div className="blog-item-intro">
                    <div className="blog-item-circle"></div>
                    <h4 className="blog-item-title">Crafting the Design for Beyond the Screen Digital Products Marketplace</h4>
                    <div className="blog-item-date">December 1, 2025</div>
                  </div>
                </a>
                <a href="/blog" className="blog-link w-inline-block">
                  <div className="blog-thumbnail">
                    <img loading="lazy" alt="Blog post thumbnail" src="/images/service-3.jpg" className="blog-thumbnail-image" />
                  </div>
                  <div className="blog-item-intro">
                    <div className="blog-item-circle"></div>
                    <h4 className="blog-item-title">Reimagining Reality Claims Site of the Week at Awwwards!</h4>
                    <div className="blog-item-date">December 1, 2025</div>
                  </div>
                </a>
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
                    <div className="margin-bottom-extra-small">
                      <div>Have a project in mind?</div>
                    </div>
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
                              <div className="footer-link-front">
                                <div>Facebook</div>
                              </div>
                              <div className="footer-link-back">
                                <div>Facebook</div>
                              </div>
                            </div>
                          </a>
                          <a href="#" target="_blank" className="footer-link w-inline-block">
                            <div className="footer-link-inner">
                              <div className="footer-link-front">
                                <div>Instagram</div>
                              </div>
                              <div className="footer-link-back">
                                <div>Instagram</div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                      <div className="footer-widget">
                        <div className="footer-links-wrapper">
                          <a href="https://x.com/" target="_blank" className="footer-link w-inline-block">
                            <div className="footer-link-inner">
                              <div className="footer-link-front">
                                <div>TikTok</div>
                              </div>
                              <div className="footer-link-back">
                                <div>TikTok</div>
                              </div>
                            </div>
                          </a>
                          <a href="#" target="_blank" className="footer-link w-inline-block">
                            <div className="footer-link-inner">
                              <div className="footer-link-front">
                                <div>LinkedIn</div>
                              </div>
                              <div className="footer-link-back">
                                <div>LinkedIn</div>
                              </div>
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
                    <div className="marquee-item">
                      <h2 className="footer-heading">MOSO</h2>
                    </div>
                    <div aria-hidden="true" className="marquee-item">
                      <div className="footer-heading">MOSO</div>
                    </div>
                    <div aria-hidden="true" className="marquee-item">
                      <div className="footer-heading">MOSO</div>
                    </div>
                    <div aria-hidden="true" className="marquee-item">
                      <div className="footer-heading">MOSO</div>
                    </div>
                    <div aria-hidden="true" className="marquee-item">
                      <div className="footer-heading">MOSO</div>
                    </div>
                    <div aria-hidden="true" className="marquee-item">
                      <div className="footer-heading">MOSO</div>
                    </div>
                  </div>
                </div>
                <div className="marquee reverse">
                  <div className="marquee-track-reverse gutter-large">
                    <div className="marquee-item margin-left">
                      <h2 className="footer-heading">AGENCY</h2>
                    </div>
                    <div aria-hidden="true" className="marquee-item margin-left">
                      <div className="footer-heading">AGENCY</div>
                    </div>
                    <div aria-hidden="true" className="marquee-item margin-left">
                      <div className="footer-heading">AGENCY</div>
                    </div>
                    <div aria-hidden="true" className="marquee-item margin-left">
                      <div className="footer-heading">AGENCY</div>
                    </div>
                    <div aria-hidden="true" className="marquee-item margin-left">
                      <div className="footer-heading">AGENCY</div>
                    </div>
                    <div aria-hidden="true" className="marquee-item margin-left">
                      <div className="footer-heading">AGENCY</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-circle-wrapper">
                <a href="/contact" className="footer-circle-link w-inline-block">
                  <div className="footer-circle-backgound">
                    <div className="footer-circle-border"></div>
                  </div>
                  <img src="/images/footer-circle-text.svg" loading="lazy" alt="Let's talk! Say hello!" className="footer-circle-image" />
                  <div className="footer-circle-icon-wrapper">
                    <div className="footer-circle-icon-front">
                      <img src="/images/OSO-4.jpg" loading="lazy" alt="" className="footer-circle-image" />
                    </div>
                    <div className="footer-circle-icon-back">
                      <img src="/images/OSO-4.jpg" loading="lazy" alt="" className="footer-circle-image" />
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="footer-row-bottom"></div>
          </div>
        </section>
      </div>

      {/* Load jQuery and Webflow JS */}
      <Script 
        src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=67ea24be240797066a84755c" 
        strategy="beforeInteractive"
      />
      <Script src="/js/webflow.js" strategy="afterInteractive" />
    </>
  )
}
