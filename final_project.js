firebase.initializeApp(config);
var orderAppReference = firebase.database();
var allPic = [];
var pic1;

function show(name, email, info, Picture) {
  let br = $('<br>');
  let br1 = $('<br>');
  let br2 = $('<br>');
  $('.show').show();
  $('.show').append(name);
  $('.show').append(br);
  $('.show').append(email);
  $('.show').append(br1);
  $('.show').append(info);
  $('.show').append(br2);
  $('.show').append(Picture);
}

$(function() {
  let showName;
  let showEmail;
  let showInfo ;
  let showPic;
  $('#new_order').on('click', function(event) {
    event.preventDefault()
    console.log('clicked')
    $('.order').show();
    $('#new_order').on('click', function(event) {
      $('.order').hide();
    })
  })
  $('#show_update').on('click', function(event) {
    event.preventDefault()
    console.log('clicked')
    $('.update').show();
    $('#show_update').on('click', function(event) {
      event.preventDefault()
      console.log('clicked')
      $('.update').hide();
    })
  })
  $('#show_cancel').on('click', function(event) {
    event.preventDefault()
    console.log('clicked')
    $('.cancel').show();
    $('#show_cancel').on('click', function(event) {
      event.preventDefault()
      console.log('clicked')
      $('.cancel').hide();
    })
  })

    $('#search_gift').on('click', function(event) {
      event.preventDefault();
      console.log("gift search clicked")
      var giftInput = $('#gift_style').val();
      var url = 'https://api.flickr.com/services/rest/?';
      var key = '91dff947fef26790e5690485e24d701a';
      let searchOptions = {
        method: 'flickr.photos.search',
        api_key: key,
        media: 'photos',
        radius: 10,
        radius_units: 'mi',
        tags: giftInput,
        format: 'json',
        nojsoncallback: 1,
        extras: 'url_n',
        content_type: 1,
        safe_search: 1,
        per_page: 10,
        sort: 'relevance',
      }
      for (let key in searchOptions) {
        url += '&' + key + '=' + searchOptions[key];
      }
      console.log(url);
      $.get(url).done(function(response) {
          console.log('response done')
          console.log(response);
          allPic = response.photos.photo;
        $.each(allPic, function(index) {
          if (this.title !== '') {
            let picture = $('<img>').attr('src', this.url_n).addClass('image');
            $('#gift_pic').append(picture);
            var $button = $(`<input id=${index} type="submit" value="choose it">`)
            $('#gift_pic').append($button)
            $button.on('click', function() {
              console.log(this.id)
              pic1 = allPic[this.id].url_n;
              console.log(pic1)
              $('#gift_pic').empty();
              $('#gift_pic').append(picture);
              // console.log(chosenPic)
            })
          }
        })
      })
    })

  $('.order').submit(function(event) {
  	event.preventDefault();
    console.log('hi')
    var Name = $('#username').val();
    var Email = $('#email').val();
    var Information = $('#msg_input').val();
    var Pic = pic1;
  	$('#msg_input').val('');
    $('#username').val('');
    $('#email').val('');
    $('#gift_pic').val('')
    
  	var orderReference = orderAppReference.ref('Orders');
  	orderReference.push({
      Name: Name,
      Email: Email,
      Information: Information,
      Picture: Pic
    })

    $('.order').hide();

    let showName = $('<h>').append(Name);
    let showEmail = $('<h>').append(Email);
    let showInfo = $('<h>').append(Information);
    let Picture = $('<img>').attr('src', Pic).addClass('image');

    show(showName, showEmail, showInfo, Picture);
  })

  $('#submit_update').on('click', function(event) {
    event.preventDefault()
    console.log("update clicked")
    var orderReference = orderAppReference.ref('Orders/' + $('#id_edit').val())
    // var Name = $('#name_update').val();
    // var Email = $('#email_update').val();
    var Information = $('#info_update').val();
    // var Picture = pic1;

    orderReference.update({
      // Name: Name,
      // Email: Email,
      Information: Information,
    })

    // var email= orderAppReference.ref('Orders/' + $('#id_edit').val()'/Email')
    // var emailValue = email.val();
    // console.log(emailValue)
    // orderAppReference.ref('Orders/' + $('#id_edit').val() + '/Email').on('value', function (results) {
    //  var emailValue = results.val();
    //  console.log(emailValue)
    // })
    orderAppReference.ref('Orders/' + $('#id_edit').val()).on('value', function (results) {
      Name = results.val();
      Email = results.val();
      Information = results.val();
      Picture = results.val()
      
      
     
    })
    
    showInfo = $('<h>').append(Information);
    $('.update').hide();
    let edited = $('<h>').text('Edited')
    $('.show').append(edited);

    show(showInfo)
  })
  
  $('#submit_cancel').on('click', function(event) {
    event.preventDefault()
    var orderReference = orderAppReference.ref('Orders/' + $('#id_cancel').val())
    orderReference.remove()
    $('.cancel').hide();
    let canceled = $('<h>').text('Canceled')
    $('.show').append(canceled);
  })
})