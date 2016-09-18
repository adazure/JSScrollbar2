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

        //Oluşturulan scroll bar
        var NScrollBarBody = document.createElement('div');
        NScrollBarBody.className = 'adDwnScrollBar';
        //Scrollbar içindeki scroll nesnesi
        var NScrollBarBodyScroll = document.createElement('div');
        NScrollBarBodyScroll.className = 'adDwnScroll';
        //Scroll hareket ettiğirildiğinde etkileşim sağlanarak kaydırılacak içerik nesnesi
        var NMoveContentObject = q.children[0];
        //Mouse ile scroll nesnesine tıklanıp tıklanmadığı bilgisini tutan değişken
        var IsMouseDownWithScroll = false;
        //Mouse ile scroll'a basıldığında ki anda bulunduğu Y/Top değerini tutan değişken
        var getTopValueWhenPushToScroll;
        //Scroll nesnesi ile aşağı doğru gidildiğinde varacağı son Top değeri
        var maxHeight = 0;
        //İçeriğin, belirlenen alandan daha küçük olması halinde scroll nesnesinin minumum yükseklik değeri
        var scrollHeightMin = 40;
        //Scroll nesnesinin sayfa içeriğine göre alacağı yükseklik değerini tutan değişken
        var scrollHeight = 0;
        //Scrollbar nesnesinde kaydırılacak boş alanın yüksekliğini tutan değişken
        var barEmptyHeight = 0;
        //İçerik yüksekliğini tutan değişken
        var contentHeight = 0;
        //Responsive
        var isResponsive = true;

        //Scroll hareket ettirildiğinde animasyon istenirse buradan yönetilecek
        var animation = {
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
                if (value <= animation.setPosition + 1 && value >= animation.setPosition - 1)
                    return true;
                else
                    return false;
            },
            //animasyonu başlatır
            start: function() {

                //Varsa öncesindeki animasyonu durdurur
                animation.stop();
                //Başlat
                animation.animateTimer = setInterval(function() {
                    try {
                        //İçerik nesnesinin o an ki pozisyon değerini alır
                        var cPos = Math.round(NMoveContentObject.style.top.replace(/[^\d.-]/g, ''));

                        //İçerik nesnesinin yeni pozisyon değeri hesaplanıyor
                        var fx = ((cPos + animation.setPosition) / 2);

                        //İçerik nesnesinin pozisyonu belirtilen aralıktaysa ve kullanıcı mouse ile basma işlemini bitirdiyse
                        //içerik nesnesinin ulaşması gereken son pozisyon değeri atanır ve animasyon kapatılır
                        if (animation.checkBetween(fx) && !animation.setContinue) {
                            NMoveContentObject.style.top = animation.setPosition + 'px';
                            animation.stop();
                        }
                        //Eğer kullanıcı butona basmayı bırakmamışsa, bırakana kadar interval çalıştırılmaya devam eder. Taki bırakana kadar.
                        else
                            NMoveContentObject.style.top = fx + 'px';

                    } catch (t) {

                    }

                    //Buradaki interval direk olarak elle 55ms olarak belirtildi. Buradaki sistem animasyonun belirli zaman dilimi içerisinde tamamlanması şeklinde de geliştirilebilir..
                    //Örneğin içeriğin ulaşacağı son noktaya 3 saniyede tamamlasın gibi Date() kullanılarak yapılabilir. Burada basit şekilde tasarlanmıştır. 
                }, 55);
            },
            //Animasyon durdurulur
            stop: function() {
                clearInterval(animation.animateTimer);
                animation.setContinue = false;
            }

        };

        //Scroll nesnesine mousedown olayı eklenmektedir.
        event(NScrollBarBodyScroll, 'mousedown', function(ev) {
            //Tıklama esnasında nesnesinin tüm işlevselliği iptal edilir.
            ev.preventDefault();
            //Scroll nesnesine basıldığı andaki pozisyon değeri alınır
            getTopValueWhenPushToScroll = ev.pageY - ev.target.offsetTop;
            //Scroll nesnesine basıldı uyarısı
            IsMouseDownWithScroll = true;

            //Eğer animasyon yapılmak isteniyorsa
            if (animation.status) {
                //Baslat
                animation.start();
                //Kullanıcı nesneye tıkladı
                animation.setContinue = true;
            }

            //nesneye basılmamış gibi davran
            return false;
        });

        //Sahne üzerinde mouse hareket ettirildiğinde takip edecek method
        event(w, 'mousemove', function(ev) {

            //Scroll nesnesine basıldığı
            if (IsMouseDownWithScroll) {

                //Scroll nesnesinin gideceği yeni pozisyon değeri
                var nY = ev.pageY - NScrollBarBody.offsetTop - getTopValueWhenPushToScroll;

                //Sınırlar kontrol ediliyor
                if (nY < 0)
                    nY = 0;
                else if (nY > maxHeight)
                    nY = maxHeight;

                //Scroll nesnesinin yeni pozisyon değeri bildiriliyor
                animation.setPosition = -Math.floor(nY * (contentHeight / barEmptyHeight));

                //Animasyon yoksa icerik pozisyon Top değerini ata
                if (!animation.status)
                    NMoveContentObject.style.top = animation.setPosition + 'px';

                //Scroll nesnesi pozisyonu aktarılıyor
                NScrollBarBodyScroll.style.top = nY + 'px';
            }
        });

        //Sayfa üzerinde mouse basılma olayı bırakıldığında
        event(w, 'mouseup', function(ev) {
            //Kullanıcı mouse'a tıklamayı bıraktı. Mouse hareket etse de iceriği hareket ettirme uyarısı
            IsMouseDownWithScroll = false;
            animation.setContinue = false;
        });

        //Ekran küçültülüp büyütültüğünde işletir
        if (!isResponsive)
            event(w, 'resize', resizer);

        //Scroll nesnesi bar nesnesi içerisine ekleniyor
        NScrollBarBody.appendChild(NScrollBarBodyScroll);

        function resizer() {

            //İçerik ve scroll nesnesinin alacağı pozisyonlar için veriler işleniyor
            //İçerik yüksekliği alan yüksekliğinden büyükse
            if (NMoveContentObject.offsetHeight > NScrollBarBody.offsetHeight) {
                q.classList.add('dwn-display');
                //İçeriğin taşan kısmı hesaplanıyor Ör : 500px
                contentHeight = (NMoveContentObject.offsetHeight - NScrollBarBody.offsetHeight);
                //Taşan kısmın toplam yükseklikte ki % yüzde değeri bulunuyor ör : %70 daha fazla içerik alanı. Tekrar 100% den çıkarılacak görünen kısım hesaplanıyor
                var percent = 100 - (contentHeight / NMoveContentObject.offsetHeight * 100);
                //Gelen %30'luk değeri bu kez scroll nesnesinin bar'a oranla yüksekliği için hesaplıyoruz
                scrollHeight = NScrollBarBody.offsetHeight / 100 * percent;
                //Scroll nesne yüksekliğinden kalan kısmıda diğer değişkene aktarıyoruz
                barEmptyHeight = NScrollBarBody.offsetHeight - scrollHeight;
                //Eğer scroll nesnesi yüksekliği minimum yükseklikten az ise minumuna eşitliyoruz
                scrollHeight = Math.max(scrollHeight, scrollHeightMin);

            }
            //Eğer içerik yüksekliği alan yüksekliğinden az ise scroll gizleniyor
            else {
                scrollHeight = scrollHeightMin;
                q.classList.remove('dwn-display');
            }

            maxHeight = NScrollBarBody.clientHeight - scrollHeight;
            NScrollBarBodyScroll.style.height = scrollHeight + 'px';
        }

        //Sayfa yüklendikten 200ms sonra sayfa boyutlandırma methodunu çalıştır
        if (!isResponsive)
            setTimeout(resizer, 200);
        else {
            setInterval(resizer, 300);
        }

        return NScrollBarBody;
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