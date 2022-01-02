import Head from 'next/head';
import Script from 'next/script';

export default function Home() {
	return (
		<div>
			<Head>
				<title>Roles Bot</title>
				<link rel="icon" href="logo.ico" />
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css" />

				<script src="https://kit.fontawesome.com/5acf4d9e80.js" crossOrigin="anonymous"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js"></script>
			</Head>
			<section className="flex-container">
				<div className="container animate__animated animate__fadeIn">
					<h1>Generate</h1>
					<form>
						<input placeholder="Your Message" name="message" id="message"/><br />
						<input placeholder="Channel Id" name="channel" id="channel"/>
					</form>
					<button id="addRole">Add Role</button>
					<button id="buttonCopy">Copy</button>
					<pre className={'hljs language-json copy'} id="jsonPre"><code id="json" className="code"></code></pre>
				</div>
			</section>

			<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
			<Script src="script.js"></Script>
			<Script id='hljs'>hljs.initHighlightingOnLoad();</Script>
		</div>
	);
}