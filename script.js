function getJSONP(url, funcName, callback) {
	var script = document.createElement('script')
	// set up the callback function, which SHOULD run before the onload event
	var ret = null;
	window[funcName] = function(e) {
		ret = e
	}
	// this will always run, whether the script loads or fails
	script.onerror = script.onload = function(e) {
		callback(ret)
		document.head.removeChild(script)
		delete window[name]
	}
	// insert script tag to send the request
	script.src = url
	document.head.appendChild(script)
}

function getTweet(id, callback) {
	var funcName = "twitterCallback_"+(String(Math.random()).replace(".", ""))
	var url = "https://twitter.com/jack/status/" + id
	getJSONP(
		"https://api.twitter.com/1/statuses/oembed.json?url="+encodeURIComponent(url)+"&callback="+encodeURIComponent(funcName)+"&omit_script=true&dnt=true",
		funcName,
		callback
	)
}

function parseTweet(tweet) {
	if (!tweet)
		return null
	
	var ret = {}
	
	// url and id
	ret.url = tweet.url
	ret.id = tweet.url.match(/\d*$/)[0]
	
	// get name and username
	ret.name = tweet.author_name
	ret.username = tweet.author_url.match(/[^\/]*$/)[0]
	
	// (parse html)
	var elem = document.createElement('div')
	elem.innerHTML = tweet.html
	
	// get tweet text
	var p = elem.querySelector('blockquote > p')
	var children = p.childNodes
	var text = ""
	for (var i=0; i<children.length; i++) {
		var c = children[i]
		text += c.textContent
		if (c.nodeName == 'BR')
			text += '\n'
	}
	ret.text = text
	
	// get date
	var dateElement = elem.querySelector('blockquote > a')
	ret.date = dateElement.textContent
	
	return ret
	// example html:
	// <blockquote class="twitter-tweet" data-dnt="true">
	//    <p lang="en" dir="ltr">
	//        the linux fan control system was probably far messier than this<br>it&#39;s just hidden better because it&#39;s mostly in software
	//        <a href="https://t.co/1YZu2EAka1">pic.twitter.com/1YZu2EAka1</a>
	//    </p>
	//	   &mdash; 12 at H3LL 📦 (@12Me21_)
	//    <a href="https://twitter.com/12Me21_/status/1389575001448255489?ref_src=twsrc%5Etfw">May 4, 2021</a>
	// </blockquote>
}
