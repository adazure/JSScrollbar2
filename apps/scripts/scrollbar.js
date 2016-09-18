(function (d, w) {

    function init() {

        var o = document.getElementsByClassName('dwn-scrollbar');

        for (var n = 0; n < o.length; n++) {
            o[n].appendChild(new createObject(o[n]));
        }

    }

    function createObject(q) {

        var nElement = document.createElement('div');
        nElement.className = 'adDwnScrollBar';
        var nElementScroll = document.createElement('div');
        nElementScroll.className = 'adDwnScroll';
        var nContent = q.children[0];

        var isDown = false;
        var x = 0, y = 0;
        var maxHeight = 0;
        var scrollHeightMin = 40;
        var scrollHeight = 0;
        var barEmptyHeight = 0;
        var contentHeight = 0;


        event(nElementScroll, 'mousedown', function (ev) {
            ev.preventDefault();
            y = ev.pageY - ev.target.offsetTop;
            isDown = true;
            return false;
        });

        event(w, 'mousemove', function (ev) {

            if (isDown) {

                var nY = ev.pageY - nElement.offsetTop - y;
                if (nY < 0)
                    nY = 0;
                else if (nY > maxHeight)
                    nY = maxHeight;

                nContent.style.top = -(nY * (contentHeight / barEmptyHeight)) + 'px';
                console.log(barEmptyHeight);

                nElementScroll.style.top = nY + 'px';
            }
        });

        event(w, 'mouseup', function (ev) {
            isDown = false;
        });

        event(w, 'resize', resizer);

        nElement.appendChild(nElementScroll);
        setTimeout(resizer, 300);
        var percent = 0;
        function resizer() {
            if (nContent.offsetHeight > nElement.offsetHeight) {
                contentHeight = (nContent.offsetHeight - nElement.offsetHeight);
                percent = 100 - (contentHeight / nContent.offsetHeight * 100);
                scrollHeight = nElement.offsetHeight / 100 * percent;
                barEmptyHeight = nElement.offsetHeight - nElementScroll.offsetHeight;
                if (scrollHeight < scrollHeightMin)
                    scrollHeight = scrollHeightMin;
            }
            else
                scrollHeight = scrollHeightMin;

            maxHeight = nElement.clientHeight - scrollHeight;
            console.log(nContent.offsetHeight);
            nElementScroll.style.height = scrollHeight + 'px';
        }


        return nElement;
    }


    //Nesneye olay ekleme methodu
    function event(a, b, c) {
        if (a.addEventListener)
            a.addEventListener(b, c, false);
        else
            a.attachEvent('on' + b, c);
    }

    event(w, 'load', init);

})(document, window);