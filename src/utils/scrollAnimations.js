// Utility for scroll-triggered animations using Intersection Observer
export const observeScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe all elements with data-animate attribute
  const elementsToAnimate = document.querySelectorAll('[data-animate]')
  elementsToAnimate.forEach((el) => observer.observe(el))

  return () => {
    elementsToAnimate.forEach((el) => observer.unobserve(el))
  }
}

// Animated counter utility
export const animateCounter = (element, target, duration = 2000) => {
  if (!element) return

  const start = 0
  const increment = target / (duration / 16)
  let current = start

  const updateCounter = () => {
    current += increment
    if (current < target) {
      element.textContent = Math.floor(current)
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = target
    }
  }

  updateCounter()
}

// Scroll progress indicator
export const setupScrollProgress = () => {
  const progressBar = document.createElement('div')
  progressBar.className = 'scroll-progress-bar'
  progressBar.setAttribute('role', 'progressbar')
  progressBar.setAttribute('aria-label', 'Scroll progress')
  document.body.appendChild(progressBar)

  const updateProgress = () => {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollableHeight = documentHeight - windowHeight
    const progress = (scrollTop / scrollableHeight) * 100

    progressBar.style.width = `${Math.min(progress, 100)}%`
  }

  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()

  return () => {
    window.removeEventListener('scroll', updateProgress)
    progressBar.remove()
  }
}
