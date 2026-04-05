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
