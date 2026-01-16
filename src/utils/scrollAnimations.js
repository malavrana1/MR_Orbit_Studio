export const observeScrollAnimations = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return () => {}
  }

  const observerOptions = {
    threshold: 0.05,
    rootMargin: '50px 0px',
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  const elementsToAnimate = document.querySelectorAll('[data-animate]')
  elementsToAnimate.forEach((el) => observer.observe(el))

  return () => {
    elementsToAnimate.forEach((el) => observer.unobserve(el))
  }
}

export const setupScrollProgress = () => {
  const progressBar = document.createElement('div')
  progressBar.className = 'scroll-progress-bar'
  progressBar.setAttribute('role', 'progressbar')
  progressBar.setAttribute('aria-label', 'Scroll progress')
  document.body.appendChild(progressBar)

  let ticking = false
  const updateProgress = () => {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollableHeight = documentHeight - windowHeight
    const progress = (scrollTop / scrollableHeight) * 100

    progressBar.style.width = `${Math.min(progress, 100)}%`
    ticking = false
  }

  const throttledUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress)
      ticking = true
    }
  }

  window.addEventListener('scroll', throttledUpdate, { passive: true })
  updateProgress()

  return () => {
    window.removeEventListener('scroll', updateProgress)
    progressBar.remove()
  }
}
