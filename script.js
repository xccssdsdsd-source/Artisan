const nav = document.getElementById('nav')
const burger = document.getElementById('burger')
const overlay = document.getElementById('overlay')
const hero = document.querySelector('.hero')

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60)
}, { passive: true })

burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open')
  overlay.classList.toggle('open', open)
  document.body.style.overflow = open ? 'hidden' : ''
})

document.querySelectorAll('.overlay__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open')
    overlay.classList.remove('open')
    document.body.style.overflow = ''
  })
})

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'))
    if (!target) return
    e.preventDefault()
    target.scrollIntoView({ behavior: 'smooth' })
  })
})

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return
    const el = entry.target
    const delay = el.dataset.delay || (Array.from(el.parentElement?.children || []).indexOf(el) * 80)
    setTimeout(() => el.classList.add('visible'), Math.min(delay, 400))
    revealObserver.unobserve(el)
  })
}, { threshold: 0.12 })

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = i % 6 * 80
  revealObserver.observe(el)
})

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    entry.target.querySelectorAll('.stat__num').forEach(el => {
      const target = +el.dataset.target
      const suffix = el.dataset.suffix || ''
      const duration = 1800
      const start = performance.now()
      const tick = now => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        el.textContent = Math.floor(eased * target) + suffix
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    countObserver.unobserve(entry.target)
  })
}, { threshold: 0.3 })

const statsSection = document.querySelector('.stats')
if (statsSection) countObserver.observe(statsSection)


document.querySelectorAll('.process__step-head').forEach(head => {
  head.addEventListener('click', () => {
    const step = head.closest('.process__step')
    const wasActive = step.classList.contains('active')
    document.querySelectorAll('.process__step').forEach(s => s.classList.remove('active'))
    if (!wasActive) step.classList.add('active')
  })
})

const form = document.getElementById('contact-form')
const success = document.getElementById('form-success')
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault()
    if (!form.checkValidity()) { form.reportValidity(); return }
    const btn = form.querySelector('.btn--submit')
    btn.textContent = 'Wysyłanie...'
    btn.disabled = true
    setTimeout(() => {
      success.classList.add('show')
      form.reset()
      btn.textContent = 'Wyślij zapytanie'
      btn.disabled = false
      setTimeout(() => success.classList.remove('show'), 5000)
    }, 900)
  })
}

setTimeout(() => hero?.classList.add('loaded'), 100)
