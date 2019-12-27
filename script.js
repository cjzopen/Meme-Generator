$(document).ready(function(){

  var canvas = document.getElementById('meme');
  var ctx = canvas.getContext('2d');
  var img = document.getElementById('start-image');
  var img_width;
  var img_height;

  ImageInfo($('#start-image').attr('src'), function(img) {
    img_width=img.width;
    img_height=img.height;
  });

  $('#start-image').on('dragstart', function(event) { event.preventDefault(); });


  function ImageInfo(path, onLoad) {
    var img = new Image();
    img.src = path;
    img.onload = function() {
      onLoad(img);
    }
  }
  function autogrow(textarea){
    var adjustedHeight = textarea.clientHeight;
    adjustedHeight = Math.max(textarea.scrollHeight,adjustedHeight);
    if (adjustedHeight>textarea.clientHeight){
      textarea.style.height=adjustedHeight+'px';
    }
  }
  function text_reset(){
    var $top=$('#text_top-container');
    var $bottom=$('#text_bottom-container')
    $top.css('transform', 'translate(0, 0)');
    $top.attr('data-x',0);
    $top.attr('data-y',0);
    $bottom.css('transform', 'translate(0, 0)');
    $bottom.attr('data-x',0);
    $bottom.attr('data-y',0);
    $('#text_top').html('<p>親戚小孩來討紅包時</p>');
    $('#text_bottom').html('<p>AAAAA</p>');
  }

  // Main drawing function
  function drawMeme(){
    ImageInfo($('#start-image').attr('src'), function(image) {
      var img = document.getElementById('start-image');
      var fontSize = parseInt( $('#text_font_size').val() );
      // var memeSize = parseInt( $('#canvas_size').val() );
      var canvas_width=image.width;
      var canvas_height=image.height;
      if(canvas_width>800 || canvas_height>800){
        alert('圖片太大');
        $('#start-image').attr('src', 'img/kokoro.jpg');
        return;
      }

      // set form field properties
      // $('#text_top_offset').attr('max', canvas_height);
      // $('#text_bottom_offset').attr('max', canvas_height);

      // initialize canvas element with desired dimensions
      canvas.width = canvas_width;
      canvas.height = canvas_height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // calculate minimum cropping dimension
  		// var croppingDimension = img.height;
  		// if( img.width < croppingDimension ){
  		// 	croppingDimension = img.width;
  		// }
  		ctx.drawImage(img, 0, 0, canvas_width, canvas.height, 0, 0, canvas_width, canvas.height);

      // settings for writing text
      ctx.lineWidth  = 4;
      ctx.font = 'bold ' + fontSize + 'px sans-serif';
      ctx.strokeStyle = 'black';
      ctx.fillStyle = $('#text_color').val();
      ctx.textAlign = 'center';
      // var lineHeight = fontSize + parseInt( $('#text_line_height').val() );
      var lineHeight = parseInt(fontSize);
      var maxTextAreaWidth = canvas_width - 4;

      // text 1
      var text1_dx = parseInt($('#text_top').parent().attr('data-x'));
      var text1_dy = parseInt($('#text_top').parent().attr('data-y'));
      var text1 = $('#text_top p');
      for(var i=0;i<text1.length;i++){
        x = (canvas_width / 2) + text1_dx;
        y = (i+1)*fontSize + 2 + text1_dy;
        writeText(ctx, text1.eq(i).text(), x, y, maxTextAreaWidth, lineHeight);
      }
      // var text1 = $('#text_top').text();
      // text1 = text1.toUpperCase();
      // x = canvas_width / 2;
      // y = 50;
      // writeText(ctx, text1, x, y, maxTextAreaWidth, lineHeight);

      // text 2
      var text2_dx = parseInt($('#text_bottom').parent().attr('data-x'));
      var text2_dy = parseInt($('#text_bottom').parent().attr('data-y'));
      var text2 = $('#text_bottom p');
      for(var i=0;i<text2.length;i++){
        x = (canvas_width / 2) + text2_dx;
        y = canvas.height + (i-1)*fontSize + text2_dy + 2;
        writeText(ctx, text2.eq(i).text(), x, y, maxTextAreaWidth, lineHeight);
      }
      // text2 = text2.toUpperCase();
      // y = canvas.height - 20;
      // writeText(ctx, text2, x, y, maxTextAreaWidth, lineHeight);
    });

  };

  // function to write text on Image
  function writeText(ctx, text, x, y, maxWidth, lineHeight){
    var words = text.split(' ');
    var line = '';
    var lines = [];

    for (var n = 0; n < words.length; n++){
  		var testLine = line + ' ' + words[n];
  		var testWidth = ctx.measureText(testLine).width;
  		if (testWidth > maxWidth)        {
  			lines.push(line);
  			line = words[n] + ' ';
  		}else{
  			line = testLine;
  		}
		}

    // pushing the last line
    lines.push(line);

    // displaying the text on canvas
    for (var k=0;k<lines.length;k++){
			ctx.strokeText(lines[k], x, y + lineHeight * k);
			ctx.fillText(lines[k], x, y + lineHeight * k);
		}

	};

  // function to change the image according to the one selected by user
  $("#imgInp").change(function(){
    var ext = this.value.match(/\.([^\.]+)$/)[1];
    switch (ext) {
      case 'jpg':
      case 'png':
      case 'jpeg':
        break;
      default:
        alert('just support jpg and png file');
        return;
    }
		var input = this;
    var img_cached;

		if (input.files && input.files[0]) {

			var reader = new FileReader();
			reader.onload = function (e) {
        img_cached = e.target.result;
				$('#start-image').attr('src', img_cached);
			}
			reader.readAsDataURL(input.files[0]);
		}

		window.setTimeout(function(){
      text_reset();
      drawMeme();
    }, 500);
	});
  $('#image_group .card').on('click',function(){
    var img_selected = $(this).find('img').attr('src');
    $('#start-image').attr('src', img_selected);

    text_reset();
    drawMeme();
  })

  // register event listeners
  $(document).on('change keydown keyup', '#text_top', function() {
    autogrow(this);
  	drawMeme();
  });
  $(document).on('change keydown keyup', '#text_bottom', function() {
    autogrow(this);
  	drawMeme();
  });
  // $(document).on('input change', '#text_top_offset', function() {
  // 	$('#text_top_offset__val').text( $(this).val() );
  // 	drawMeme();
  // });
  // $(document).on('input change', '#text_bottom_offset', function() {
  // 	$('#text_bottom_offset__val').text( $(this).val() );
  // 	drawMeme();
  // });
  $(document).on('input change', '#text_font_size', function() {
  	$('#text_font_size__val').text( $(this).val() );
    $('#text_top-container,#text_bottom-container').css({
      'font-size':$(this).val()+'px',
      'line-height':$(this).val()+'px'
    });
  	drawMeme();
  });
  $(document).on('change keydown keyup', '#text_color', function() {
    $('.editable,#text_color__val').css({
      'color':$(this).val()
    });
    $('#text_color__val').text($(this).val());
    drawMeme();
  });
  // $(document).on('input change', '#text_line_height', function() {
  // 	$('#text_line_height__val').text( $(this).val() );
  // 	drawMeme();
  // });
  // $(document).on('input change', '#text_stroke_width', function() {
  // 	$('#text_stroke_width__val').text( $(this).val() );
  // 	drawMeme();
  // });
  // $(document).on('input change', '#canvas_size', function() {
  // 	$('#canvas_size__val').text( $(this).val() );
  // 	drawMeme();
  // });
  $(document).on('click','#preview',function(){
    $('#meme-container').addClass('d-flex');
    $('html,body').addClass('overflow-hidden');
  });
   $(document).on('click','#meme-container',function(){
    $(this).removeClass('d-flex');
    $('html,body').removeClass('overflow-hidden');
   });

  $('#download_meme').click(function(e){
		$(this).attr('href', canvas.toDataURL());
		$(this).attr('download', 'meme.png');
	});

  // replace this with a server-side processing method
	$('#download_meme').click(function(e){
		$(this).attr('href', canvas.toDataURL());
		$(this).attr('download', 'meme.png');
	});
  $(document).on('click', '#share-area .btn', function(e) {
    e.preventDefault();
    var $this = $(this);
    var image_data = $('#share-area').attr('data-url');
    var image_data_new = canvas.toDataURL();
    var imgur_link='';
    if(image_data !== image_data_new){
      $('#share-area').attr('data-url', canvas.toDataURL());
      $.ajax({
        type: "POST",
        url: "imgur.php",
        data: {image:$('#share-area').attr('data-url')},
        beforeSend: function(){
          $('#share-area').hide();
        }
      }).done(function(received){
        console.log(JSON.parse(received));
        if(JSON.parse(received).success){
          imgur_link = JSON.parse(received).data.link;
          if($this.attr('id')=='facebook'){
            window.open(encodeURI('https://facebook.com/sharer/sharer.php?u='+imgur_link));
          }else{
            window.open(encodeURI('https://www.addtoany.com/add_to/line?linkurl='+imgur_link+'&linkname=meme&linknote=meme'));
          }
        }else{
          alert(JSON.parse(received).data.error);
        }
      }).fail(function(x,e){
        if (x.status==0) {
          alert('You are offline!!\n Please Check Your Network.');
        } else if(x.status==404) {
          alert('Requested URL not found');
        } else if(x.status==500) {
          alert('Internel Server Error');
        } else if(e=='parsererror') {
          alert('Parsing JSON Request failed');
        } else if(e=='timeout'){
          alert('Request Time out');
        } else {
          alert('Unknow Error');
        }
      }).always(function(){
        $('#share-area').show();
      });
    }else{
      if($this.attr('id')=='facebook'){
        window.open(encodeURI('https://facebook.com/sharer/sharer.php?u='+imgur_link));
      }else{
        window.open(encodeURI('https://www.addtoany.com/add_to/line?linkurl='+imgur_link+'&linkname=meme&linknote=meme'));
      }
    }
    return false;
  });

	// init at startup
	window.setTimeout(function(){
		drawMeme();
	}, 100);

  // interact('.draggable').draggable({
  //   onmove(event) {
  //     console.log(event.pageX,event.pageY)
  //   }
  // });
  // target elements with the "draggable" class
  interact('.draggable').draggable({
      // enable inertial throwing
    inertia: true,
      // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
      // enable autoScroll
    autoScroll: true,

      // call this function on every dragend event
      onend: function (event) {
        drawMeme();
      //   var textEl = event.target.querySelector('p')

      //   textEl && (textEl.textContent =
      //     'moved a distance of ' +
      //     (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
      //                Math.pow(event.pageY - event.y0, 2) | 0))
      //       .toFixed(2) + 'px')
      },
      // call this function on every dragmove event
    onmove: dragMoveListener
  })

  function dragMoveListener (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // translate the element
    target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;

  var editor = new MediumEditor('.editable', {
    toolbar: false,
    placeholder: false
  });
});
