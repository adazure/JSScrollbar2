(function(d, w) {

    function init() {

        //Sayfa üzerindeki tüm "dwn-scrollbar" sınıfına ait tüm nesneleri seçer
        var o = document.getElementsByClassName('dwn-scrollbar');

        //Her bir nesne için scroll özelliği eklenir
        for (var n = 0; n < o.length; n++) {
            o[n].appendChild(new createObject(o[n]));
        }

    }

    //Scroll özelliği ekleyeceğimiz nesnemiz
    function createObject(q) {

        var _ = this;

        var Z = q;
        //Oluşturulan scroll bar
        _.NScrollBarBody = document.createElement('div');
        _.NScrollBarBody.className = 'adDwnScrollBar';
        //Scrollbar içindeki scroll nesnesi
        _.NScrollBarBodyScroll = document.createElement('div');
        _.NScrollBarBodyScroll.className = 'adDwnScroll';
        //Scroll hareket ettiğirildiğinde etkileşim sağlanarak kaydırılacak içerik nesnesi
        _.NMoveContentObject = Z.children[0];
        //Mouse ile scroll nesnesine tıklanıp tıklanmadığı bilgisini tutan değişken
        _.IsMouseDownWithScroll = false;
        //Mouse ile scroll'a basıldığında ki anda bulunduğu Y/Top değerini tutan değişken
        _.getTopValueWhenPushToScroll;
        //Scroll nesnesi ile aşağı doğru gidildiğinde varacağı son Top değeri
        _.maxHeight = 0;
        //İçeriğin, belirlenen alandan daha küçük olması halinde scroll nesnesinin minumum yükseklik değeri
        _.scrollHeightMin = 40;
        //Scroll nesnesinin sayfa içeriğine göre alacağı yükseklik değerini tutan değişken
        _.scrollHeight = 0;
        //Scrollbar nesnesinde kaydırılacak boş alanın yüksekliğini tutan değişken
        _.barEmptyHeight = 0;
        //İçerik yüksekliğini tutan değişken
        _.contentHeight = 0;
        //Responsive
        _.isResponsive = true;
        //Scroll özelliği body nesnesine uygulanmaya çalışıldığında kontrol edilecek değişken
        _.isBody = Z.tagName && Z.tagName == "BODY";

        //Scroll hareket ettirildiğinde animasyon istenirse buradan yönetilecek
        _.animation = {
            //Anlık olarak oluşturulan interval için kullanılacak değişken
            timer: 0,
            //Animasyon isteniyorsa true/false
            status: true,
            //içeriğin duracağı Top değeri bu alana aktarılacak
            setPosition: 0,
            //Anlık kullanımlar için oluşturuldu. Kullanıcı tıklamayı bıraktıktan sonra eğer animasyon istenen pozisyona gitmediyse bu alanın true veya false olmasına göre 
            //animasyonun tamamlanana kadar sürmesini sağlayacağız
            setContinue: false,
            //İçeriğin belirlenen pozisyon aralığına geldiğinde animasyonu bitirip bitirmemesini kontrol eden method
            checkBetween: function(value) {
                if (value <= _.animation.setPosition + 1 && value >= _.animation.setPosition - 1)
                    return true;
                else
                    return false;
            },
            //animasyonu başlatır
            start: function() {

                //Varsa öncesindeki animasyonu durdurur
                _.animation.stop();
                //Başlat
                _.animation.animateTimer = setInterval(function() {
                    try {
                        //İçerik nesnesinin o an ki pozisyon değerini alır
                        var cPos = Math.round(_.NMoveContentObject.style.top.replace(/[^\d.-]/g, ''));

                        //İçerik nesnesinin yeni pozisyon değeri hesaplanıyor
                        var fx = ((cPos + _.animation.setPosition) / 2);

                        //İçerik nesnesinin pozisyonu belirtilen aralıktaysa ve kullanıcı mouse ile basma işlemini bitirdiyse
                        //içerik nesnesinin ulaşması gereken son pozisyon değeri atanır ve animasyon kapatılır
                        if (_.animation.checkBetween(fx) && !_.animation.setContinue) {
                            _.NMoveContentObject.style.top = _.animation.setPosition + 'px';
                            _.animation.stop();
                        }
                        //Eğer kullanıcı butona basmayı bırakmamışsa, bırakana kadar interval çalıştırılmaya devam eder. Taki bırakana kadar.
                        else
                            _.NMoveContentObject.style.top = fx + 'px';

                    } catch (t) {

                    }

                    //Buradaki interval direk olarak elle 55ms olarak belirtildi. Buradaki sistem animasyonun belirli zaman dilimi içerisinde tamamlanması şeklinde de geliştirilebilir..
                    //Örneğin içeriğin ulaşacağı son noktaya 3 saniyede tamamlasın gibi Date() kullanılarak yapılabilir. Burada basit şekilde tasarlanmıştır. 
                }, 55);
            },
            //Animasyon durdurulur
            stop: function() {
                clearInterval(_.animation.animateTimer);
                _.animation.setContinue = false;
            }

        };

        //Scroll nesnesine mousedown olayı eklenmektedir.
        event(_.NScrollBarBodyScroll, 'mousedown', function(ev) {

            //Tıklama esnasında nesnesinin tüm işlevselliği iptal edilir.
            ev.preventDefault();
            //Scroll nesnesine basıldığı andaki pozisyon değeri alınır
            _.getTopValueWhenPushToScroll = ev.pageY - ev.target.offsetTop;
            //Scroll nesnesine basıldı uyarısı
            _.IsMouseDownWithScroll = true;

            //Eğer animasyon yapılmak isteniyorsa
            if (_.animation.status) {
                //Baslat
                _.animation.start();
                //Kullanıcı nesneye tıkladı
                _.animation.setContinue = true;
            }

            //nesneye basılmamış gibi davran
            return false;
        });

        //Sahne üzerinde mouse hareket ettirildiğinde takip edecek method
        event(w, 'mousemove', function(ev) {

            //Scroll nesnesine basıldığı
            if (_.IsMouseDownWithScroll) {

                //Scroll nesnesinin gideceği yeni pozisyon değeri
                var nY = ev.pageY - _.NScrollBarBody.offsetTop - _.getTopValueWhenPushToScroll;

                //Sınırlar kontrol ediliyor
                if (nY < 0)
                    nY = 0;
                else if (nY > _.maxHeight)
                    nY = _.maxHeight;


                //Scroll nesnesinin yeni pozisyon değeri bildiriliyor
                _.animation.setPosition = -Math.floor(nY * (_.contentHeight / _.barEmptyHeight));

                //Animasyon yoksa icerik pozisyon Top değerini ata
                if (!_.animation.status)
                    _.NMoveContentObject.style.top = _.animation.setPosition + 'px';

                //Scroll nesnesi pozisyonu aktarılıyor
                _.NScrollBarBodyScroll.style.top = nY + 'px';
            }
        });

        //Sayfa üzerinde mouse basılma olayı bırakıldığında
        event(w, 'mouseup', function(ev) {
            //Kullanıcı mouse'a tıklamayı bıraktı. Mouse hareket etse de iceriği hareket ettirme uyarısı
            _.IsMouseDownWithScroll = false;
            _.animation.setContinue = false;
        });

        //Ekran küçültülüp büyütültüğünde işletir
        if (!_.isResponsive)
            event(w, 'resize', resizer);

        //Scroll nesnesi bar nesnesi içerisine ekleniyor
        _.NScrollBarBody.appendChild(_.NScrollBarBodyScroll);

        function resizer() {

            var iHeight = _.isBody ? w.innerHeight : _.NScrollBarBody.getFullHeight();

            //İçerik ve scroll nesnesinin alacağı pozisyonlar için veriler işleniyor
            //İçerik yüksekliği alan yüksekliğinden büyükse
            var WrapAndContentHeight = _.NMoveContentObject.getFullHeight() + Z.getFullHeightPadding() + Z.getFullHeightMargin();

            if (WrapAndContentHeight > iHeight) {
                Z.classList.add('dwn-display');
                Z.classList.remove('dwn-nodisplay');
                //İçeriğin taşan kısmı hesaplanıyor Ör : 500px
                _.contentHeight = (WrapAndContentHeight - iHeight);
                //Taşan kısmın toplam yükseklikte ki % yüzde değeri bulunuyor ör : %70 daha fazla içerik alanı. Tekrar 100% den çıkarılacak görünen kısım hesaplanıyor
                var percent = 100 - (_.contentHeight / WrapAndContentHeight * 100);
                //Gelen %30'luk değeri bu kez scroll nesnesinin bar'a oranla yüksekliği için hesaplıyoruz
                _.scrollHeight = iHeight / 100 * percent;
                //Scroll nesne yüksekliğinden kalan kısmıda diğer değişkene aktarıyoruz
                _.barEmptyHeight = iHeight - _.scrollHeight;
                //Eğer scroll nesnesi yüksekliği minimum yükseklikten az ise minumuna eşitliyoruz
                _.scrollHeight = Math.max(_.scrollHeight, _.scrollHeightMin);

            }
            //Eğer içerik yüksekliği alan yüksekliğinden az ise scroll gizleniyor
            else {
                _.scrollHeight = _.scrollHeightMin;
                Z.classList.remove('dwn-display');
                Z.classList.add('dwn-nodisplay');
            }

            _.maxHeight = (_.isBody ? w.innerHeight : _.NScrollBarBody.getFullHeight()) - _.scrollHeight;
            _.NScrollBarBodyScroll.style.height = _.scrollHeight + 'px';
        }

        //Sayfa yüklendikten 200ms sonra sayfa boyutlandırma methodunu çalıştır
        if (!_.isResponsive)
            setTimeout(resizer, 200);
        else {
            setInterval(resizer, 300);
        }

        return _.NScrollBarBody;
    }


    Element.prototype.getCss = function(name) {
        var x = ((this.currentStyle || w.getComputedStyle(this))[name]);
        if (!x) return 0;
        return Math.round(x.replace(/[^\d.-]/g, ''));
    }

    Element.prototype.getFullHeight = function() {
        return ((this.offsetHeight || this.clientHeight || this.innerHeight) + this.getCss("marginTop") + this.getCss("marginBottom") + this.getCss('paddingTop') + this.getCss('paddingBottom') + this.getCss('borderTop') + this.getCss('borderBottom'));
    }

    Element.prototype.getFullWidth = function() {
        return ((this.offsetWidth || this.clientWidth || this.innerWidth) + this.getCss("marginLeft") + this.getCss("marginRight") + this.getCss('paddingLeft') + this.getCss('paddingRight') + this.getCss('borderLeft') + this.getCss('borderRight'));
    }

    Element.prototype.getFullHeightPadding = function() {
        return (this.getCss('paddingTop') + this.getCss('paddingBottom'));
    }

    Element.prototype.getFullWidthPadding = function() {
        return (this.getCss('paddingLeft') + this.getCss('paddingRight'));
    }

    Element.prototype.getFullHeightMargin = function() {
        return (this.getCss('MarginTop') + this.getCss('MarginBottom'));
    }

    Element.prototype.getFullWidthMargin = function() {
        return (this.getCss('MarginLeft') + this.getCss('MarginRight'));
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