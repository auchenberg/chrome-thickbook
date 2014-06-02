(function() {

	var elmBookDetails = document.querySelector('#productDetailsTable, #detail_bullets_id');

	if(!elmBookDetails) {
		console.log('amazon.book.no.book');
		return;
	}

	// Kindle detection
	var isKindle = elmBookDetails.textContent.indexOf('Product Dimensions') === -1;

	// Pages
	var textPages = elmBookDetails.textContent;
	var pagesMatches = textPages.match(/(Hardcover|Paperback|Print Length): (\d{1,}) pages/);

	if(pagesMatches.length) {
		numberOfPages = pagesMatches[2];
	}			
	
	// Dimensions
	var paperClipOriginalHeight = 3.3;

	var elmDimensionNodes = elmBookDetails.querySelectorAll('li:nth-child(6), li:nth-child(7)');
	var textDimensions = Array.prototype.map.call(elmDimensionNodes, function(elmNode) {
		return elmNode.textContent;
	}).join('');

	var isMeasureInInches = textDimensions.indexOf('inches') > -1;
	var dimensionsMatches = textDimensions.match(/(\d+(\.\d{1,})?)/g);

	console.log('dimensionsMatches',dimensionsMatches);
	if(isKindle) {
		console.log('amazon.book.kindle', true);
		bookHeight = 0.00762 * numberOfPages; // Use number of pages to base the height

	} else {
		if(dimensionsMatches.length) {
			bookHeight = dimensionsMatches[2];

			if(isMeasureInInches) {
				bookHeight = 2.54 * bookHeight;
			}	
		}
	}

	console.log('amazon.book.bookHeight', bookHeight);
	paperClipScale = 120 * ((paperClipOriginalHeight / bookHeight));				

	// Reading time
	var timeInSeconds = numberOfPages * 42 // 7 minutes to read one page;
	var timeInMinutes = timeInSeconds / 60;
	var timeInHours = timeInMinutes / 60;
	var roundedHours = Math.floor(timeInHours);
	var quateredMinutes = (Math.round(timeInMinutes/30) * 30);

	var time = roundedHours + (quateredMinutes === 60 ? '½' : '') + ' hours ';

	if(roundedHours === 0) {
		time = (Math.round(timeInMinutes/15) * 15) + ' minutes';
	}

	console.log('amazon.book.numberOfPages', numberOfPages);
	console.log('amazon.book.time', time);

	// Inject block
	var elmImageBlock = document.querySelector('#imageBlock, #main-image-widget');
	var elmParent = elmImageBlock.parentNode;

	var content = '<img class="paperclip" style="height:' + paperClipScale + 'px;" src=" ' +chrome.extension.getURL("paperclip.svg") + '" />' + 
				  '<div class="info">' +
				  '<div>' +
				  	'<div class="time">' + time + '</div>' +
				  	'<div class="pages">(' + numberOfPages + ' pages)</div>';
				  '</div>';
				  '</div>';

	var elmInfo = document.createElement('div');
	elmInfo.classList.add('book-reading-info');
	elmInfo.innerHTML = content;

	if(paperClipScale > 120) {
		elmInfo.style.height = paperClipScale + 40 + 'px';
	}

	var mainImageWidth = document.querySelector('#holderMainImage img').width;
	if(mainImageWidth) {
		elmInfo.style.width = mainImageWidth + 'px';
	}

	// Insert After
	elmParent.insertBefore(elmInfo, elmImageBlock.nextSibling);

})();
