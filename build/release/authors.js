import fs from "node:fs/promises";
import util from "node:util";
import { exec as nodeExec } from "node:child_process";

const exec = util.promisify( nodeExec );

const rnewline = /\r?\n/;

const ignore = [
	/dependabot\[bot\]/
];

// Authors who contributed before the project was on GitHub.
// They won't appear in the git log, so they are listed here
// to be prepended to the generated AUTHORS.txt.
const preamble = [
	"Richard D. Worth <rdworth@gmail.com>",
	"Eduardo Lundgren <eduardolundgren@gmail.com>",
	"Scott González <scott.gonzalez@gmail.com>",
	"Trey Hunner <treyhunner@gmail.com>"
];

function compareAuthors( a, b ) {
	const aName = a.normalize( "NFC" ).replace( / <.*>/, "" );
	const bName = b.normalize( "NFC" ).replace( / <.*>/, "" );
	return aName === bName;
}

function uniq( arr ) {
	const unique = [];
	for ( const item of arr ) {
		if ( ignore.some( re => re.test( item ) ) ) {
			continue;
		}
		if ( item && !unique.find( e => compareAuthors( e, item ) ) ) {
			unique.push( item );
		}
	}
	return unique;
}

async function getLastAuthor() {
	const authorsTxt = await fs.readFile( "AUTHORS.txt", "utf8" );
	return authorsTxt.trim().split( rnewline ).pop();
}

export async function getAuthors() {
	console.log( "Getting authors..." );
	const { stdout } = await exec( "git log --format='%aN <%aE>'" );
	const gitAuthors = uniq( stdout.trim().split( rnewline ).reverse() );

	// Filter out preamble authors from the git log to avoid duplicates.
	const filtered = gitAuthors.filter( ( author ) =>
		!preamble.find( p => compareAuthors( p, author ) )
	);

	return [ ...preamble, ...filtered ];
}

export async function checkAuthors() {
	const authors = await getAuthors();
	const lastAuthor = await getLastAuthor();

	if ( authors[ authors.length - 1 ] !== lastAuthor ) {
		console.log( "AUTHORS.txt: ", lastAuthor );
		console.log( "Last 20 in git: ", authors.slice( -20 ) );
		throw new Error( "Last author in AUTHORS.txt does not match last git author" );
	}
	console.log( "AUTHORS.txt is up to date" );
}

export async function updateAuthors() {
	const authors = await getAuthors();
	const authorsTxt = "Authors ordered by first contribution.\n\n" + authors.join( "\n" ) + "\n";
	await fs.writeFile( "AUTHORS.txt", authorsTxt );
	console.log( "AUTHORS.txt updated" );
}
