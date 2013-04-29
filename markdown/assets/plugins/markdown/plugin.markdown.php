/**
 *  Markdown Parser for MODx
 *  "by" Guillaume Grenier (I just changed 2 or 3 things...)
 *  A rip-off of the Textile plugin by Raymond Irving
 *
 *  Uses the PHP Markdown Extra parser by Michel Fortin
 *  <http://www.michelf.com/projects/php-markdown/>
 *  Markdown is by John Gruber
 *  <http://daringfireball.net/projects/markdown/>
 */ 

global $MarkdownObj;

$e = &$modx->Event;

switch ($e->name) {
	case "OnWebPagePrerender":	
		include_once($modx->config["base_path"].'/assets/plugins/markdown.php');
		$doc = $modx->documentOutput;
		preg_match_all("|<markdown>(.*)</markdown>|Uis",$doc,$matches);
		for ($i=0;$i<count($matches[0]);$i++) {
			$tag = $matches[0][$i];
			$text = Markdown($matches[1][$i]);
			$doc = str_replace($tag,$text,$doc);
		}
		$modx->documentOutput = $doc;
		break;
		
	default:	// stop here
		return; 
		break;	
}

return $markdown;