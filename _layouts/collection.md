{% assign archive_collection = site.collections | where: 'label',page.collection | first%}

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{archive_collection.title}} | Bit Criminals</title>
    <link rel="icon" type="image/png" sizes="64x64" href="images/myfavicon.png">
    <link rel="stylesheet" href="https://unpkg.com/flickity@2/dist/flickity.min.css">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/global.css">
    <link rel="stylesheet" href="/css/collection.css">
</head>
<body>
    {% include header.html %}
    <main>
        <h1>{{ archive_collection.title }} Writeups</h1>
        <div class="grid">
            {% assign writeups = site[page.collection] | reverse %}
            {% for writeup in writeups %}
                <a href="{{ writeup.url }}" class="grid-cell">
                    <div class="grid-image">
                        <img src="/images/category-thumbnails/{{ writeup.type | downcase }}.png" alt="">
                    </div>
                    <div class="grid-content">{{writeup.title}}</div>
                </a>
            {% endfor %}
        </div>
    </main>
    {% include footer.html %}
    <script src="https://kit.fontawesome.com/4e16efa13b.js" crossorigin="anonymous"></script>
    <script src="/js/global.js"></script>
</body>
</html>