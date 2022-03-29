---
permalink: /
layout: blank
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bit Criminals</title>
    <link rel="icon" type="image/png" sizes="64x64" href="images/myfavicon.png">
    <link rel="stylesheet" href="https://unpkg.com/flickity@2/dist/flickity.min.css">
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/index.css">
</head>
<body>
    <div class="loader"></div>
    {% include header.html %}
    <main>
        <div class="wrapper landing">
            <div class="landing-main">
                <div class="landing-main--content">
                    <div class="landing-main--content--title"></div>
                    <div class="landing-main--content--content"></div>
                </div>
                <div class="landing-main--image">
                    <img src="images/logo.png" alt="Bit Criminals Logo">
                </div>
            </div>
            <div class="landing-extra">
                Criminal Group:<br>57005
            </div>
        </div>
        <div class="divider"></div>
        <div class="wrapper">
            <div class="anchor-link" id="about"></div>
            <div class="wrapper-image">
                <div id="about-us-image">
                    Plan #34
                </div>
            </div>
            <div class="wrapper-content">
                <div class="wrapper-content--title">
                    About Us
                </div>
                <div class="wrapper-content--content">
                    We really are just a bunch of people who like committing crimes.
                    <ul class="social-links">
                        <li><div class="icon-box"><a href="https://github.com/bitcriminals"><img src="images/github.png" height=50 width=50 alt=""></a></div></li>
                        <li><div class="icon-box"><a href="https://ctftime.org/team/151727"><img src="images/ctftime.png" height=50 width=50 alt=""></a></div></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="wrapper">
            <div class="anchor-link" id="reports"></div>
            <div class="wrapper-content">
                <div class="wrapper-content--title">
                    Our Crime Reports
                </div>
                <div class="wrapper-content--content center-align">
                    <div class="writeup-grid main-carousel">
                        {% for ctf in site.collections %}
                            {% if ctf.label != "posts" %}
                                <a href="/{{ ctf.label }}" class="writeup-grid-cell carousel-cell">
                                    <div class="writeup-grid-image"><img src="{{ ctf.image }}" alt=""></div>
                                    <div class="writeup-grid-content">{{ ctf.title }}</div>
                                </a>
                            {% endif %}
                        {% endfor %}
                    </div>
                    <!-- <a href="">
                        <button>See All Reports!</button>
                    </a> -->
                </div>
            </div>
        </div>
        <div class="wrapper">
            <div class="anchor-link" id="members"></div>
            <div class="wrapper-content">
                <div class="wrapper-content--title">
                    Our Criminals
                </div>
                <div class="wrapper-content--content">
                    <div class="grid">
                        <div class="grid-cell">
                            <div class="grid-image">
                                <img src="images/reversedeyes.png" alt="">
                                <div class="grid-image-overlay">
                                    <div class="overlay-text">
                                        <ul class="social-media-links">
                                            <li><a href="https://github.com/sudoshreyansh" target="_blank"><img src="images/github.png" alt=""></a></li>
                                            <li><a href="https://www.linkedin.com/in/shreyansh-jain-34b2271b2/" target="_blank"><img src="images/linkedin.png" alt=""></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="grid-content">ReversedEyes</div>
                        </div>
                        <div class="grid-cell">
                            <div class="grid-image">
                                <img src="images/MaskdMafia.jpg" alt="">
                                <div class="grid-image-overlay">
                                    <div class="overlay-text">
                                        <ul class="social-media-links">
                                            <li><a href="https://github.com/AnantarupaRoy" target="_blank"><img src="images/github.png" alt=""></a></li>
                                            <li><a href="https://www.linkedin.com/in/anantarupa-hore-roy/" target="_blank"><img src="images/linkedin.png" alt=""></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="grid-image-overlay"></div>
                            <div class="grid-content">MaskdMafia</div>
                        </div>
                        <div class="grid-cell">
                            <div class="grid-image"><img src="images/ayelmao.jpg" alt="">
                                <div class="grid-image-overlay">
                                    <div class="overlay-text">
                                        <ul class="social-media-links">
                                            <li><a href="https://github.com/justanothern00b" target="_blank"><img src="images/github.png" alt=""></a></li>
                                            <li><a href="https://www.linkedin.com/in/raunak-asnani/" target="_blank"><img src="images/linkedin.png" alt=""></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="grid-content">justanothernoob</div>
                        </div>
                        <div class="grid-cell">
                            <div class="grid-image"><img src="images/archi.jpg" alt="">
                                <div class="grid-image-overlay">
                                    <div class="overlay-text">
                                        <ul class="social-media-links">
                                            <li><a href="https://github.com/ArijitGuha-Begineer" target="_blank"><img src="images/github.png" alt=""></a></li>
                                            <li><a href="https://www.linkedin.com/in/arijit-guha-197a5420a/" target="_blank"><img src="images/linkedin.png" alt=""></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="grid-content">Dr.D0NN4</div>
                        </div>
                        <div class="grid-cell">
                            <div class="grid-image"><img src="images/v1per.png" alt="">
                                <div class="grid-image-overlay">
                                    <div class="overlay-text">
                                        <ul class="social-media-links">
                                            <li><a href="https://github.com/himanshudas75" target="_blank"><img src="images/github.png" alt=""></a></li>
                                            <li><a href="https://www.linkedin.com/in/himanshu-das-448517200/" target="_blank"><img src="images/linkedin.png" alt=""></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="grid-content">v1per</div>
                        </div>
                        <div class="grid-cell">
                            <div class="grid-image"><img src="images/Alphx.jpeg" alt="">
                                <div class="grid-image-overlay">
                                    <div class="overlay-text">
                                        <ul class="social-media-links">
                                            <li><a href="https://github.com/Alphx-rgb" target="_blank"><img src="images/github.png" alt=""></a></li>
                                            <li><a href="https://www.linkedin.com/in/ayush-budhiraja-a55a891a8/" target="_blank"><img src="images/linkedin.png" alt=""></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="grid-content">Alphx</div>
                        </div>
                        <div class="grid-cell">
                            <div class="grid-image"><img src="images/darkdemian.jpg" alt="">
                                <div class="grid-image-overlay">
                                    <div class="overlay-text">
                                        <ul class="social-media-links">
                                            <li><a href="https://github.com/AyushAjay14" target="_blank"><img src="images/github.png" alt=""></a></li>
                                            <li><a href="https://www.linkedin.com/in/ayush-ajay-6b6773207/" target="_blank"><img src="images/linkedin.png" alt=""></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="grid-content">Dark Demian</div>
                        </div>
                        <div class="grid-cell">
                            <div class="grid-image"><img src="images/otaku.png" alt="">
                                <div class="grid-image-overlay">
                                    <div class="overlay-text">
                                        <ul class="social-media-links">
                                            <li><a href="https://github.com/Ni2-1911" target="_blank"><img src="images/github.png" alt=""></a></li>
                                            <li><a href="https://www.linkedin.com/in/nitu-kumari-407495185/" target="_blank"><img src="images/linkedin.png" alt=""></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="grid-content">Otaku_</div>
                        </div>
                        <div class="grid-cell">
                            <div class="grid-image"><img src="images/Leo.png" alt="">
                                <div class="grid-image-overlay">
                                    <div class="overlay-text">
                                        <ul class="social-media-links">
                                            <li><a href="https://github.com/Leo-2807" target="_blank"><img src="images/github.png" alt=""></a></li>
                                            <li><a href="https://www.linkedin.com/mwlite/in/deeksha-bijarniya-50430b210" target="_blank"><img src="images/linkedin.png" alt=""></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="grid-content">Leo</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    {% include footer.html %}
    <div class="terminal">
    </div>
    <script src="https://kit.fontawesome.com/4e16efa13b.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/typeit@7.0.4/dist/typeit.min.js"></script>
    <script src="https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js"></script>
    <script src="js/index.js"></script>
    <script src="js/global.js"></script>
</body>
</html>
