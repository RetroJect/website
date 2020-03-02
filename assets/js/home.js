$('[href*="#"]').on('click', (e) => {
  var target = $(this.hash);
  if (target.length) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: target.offset().top
    }, 0, 'swing')
  }
});

$('#toTop').click(() => {
  $('html, body').animate({
    scrollTop: 0
  }, 0, 'swing')
})

$('.popup').popup();