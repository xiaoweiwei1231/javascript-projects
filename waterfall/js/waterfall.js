;(function (win, doc) {
  
  var Waterfall = function (options) {
    this.el = doc.getElementsByClassName(options.el)[0];
  	this.imgApi = options.imgApi;
    this.column = options.column;
    this.gap = options.gap;
    this.itemWidth = (this.el.offsetWidth - (this.column - 1) * this.gap) / this.column;
    this.pageNum = 0;
    this.pageSize = 0;
    this.imgSize = 0;
    this.imgFrom = 0;
    this.heightArr = [];
  }

  Waterfall.prototype.init = function () {
    this.getImgDatas(this.pageNum);
    this.bindEvent();
  }

  Waterfall.prototype.bindEvent = function () {
    window.addEventListener('scroll', this.scrollToBottom.bind(this), false);
  }

  Waterfall.prototype.scrollToBottom = function () {
  	if (getScrollTop() + getWindowHeight() == getScrollHeight()) {
  		this.pageNum ++;

  		if (this.pageNum <= this.pageSize - 1) {
  			this.getImgDatas(this.pageNum);
  		}
  	}
  }

  Waterfall.prototype.renderList = function (data, pageNum) {
    var oFrag = doc.createDocumentFragment(),
        minIdx = -1;

    data.forEach(function (elem, idx) {
      minIdx = getMinIdx(this.heightArr);

      var oItem = doc.createElement('div'),
          oImg = new Image();

      var itemHeight = this.itemWidth * elem.height / elem.width,
          itemLeft = (idx + 1) % this.column === 1 ? '0' : idx * (this.itemWidth + this.gap),
          minHeightElemLeft = minIdx === 0 ? 0 : (minIdx * (this.itemWidth + this.gap));

      oItem.className = 'wf-item';
      oItem.style.width = this.itemWidth + 'px';
      oItem.style.height = itemHeight + 'px';
      oImg.src = elem.img;
      oImg.className = 'wf-img';

      oItem.appendChild(oImg);
      oFrag.appendChild(oItem);    

      if (idx < this.column && pageNum === 0) {
      	this.heightArr.push(itemHeight);
      	oItem.style.top = '0';
      	oItem.style.left = itemLeft + 'px';
      } else {
      	oItem.style.left = minHeightElemLeft + 'px';
      	oItem.style.top = (this.heightArr[minIdx] + this.gap) + 'px';
      	this.heightArr[minIdx] += (itemHeight + this.gap);
      }

    }, this);

    this.el.appendChild(oFrag);
    this.showImgs(this.imgFrom);
  }

  Waterfall.prototype.showImgs = function (imgFrom) {
  	var oImgs = doc.getElementsByClassName('wf-img'),
        len = oImgs.length,
        item;

    for (var i = imgFrom; i < len; i ++) {
    	item = oImgs[i];

    	item.onload = function () {
    		this.style.opacity = 1;
    	}
    }
  }

  Waterfall.prototype.getImgDatas = function (pageNum) {
    var _self = this;

    xhr.ajax({
    	url: this.imgApi,
    	type: 'POST',
    	dataType: 'JSON',
    	data: {
    		pageNum: pageNum
    	},
    	success: function (data) {
    		if (data !== 'NO DATA') {
    			var pageData = JSON.parse(data.pageData),
    			    len = pageData.length;

    			_self.imgSize += len;
    			_self.imgFrom = pageNum !== 0 ? (_self.imgSize - len) : 0;
    			_self.pageSize = parseInt(data.pageSize);
    			_self.renderList(pageData, _self.pageNum);
    		}
    	}
    })
  }

  function getMinIdx (arr) {
  	return [].indexOf.call(arr, Math.min.apply(null, arr));
  }


  win.Waterfall = Waterfall;

})(window, document);










