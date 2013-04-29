/**
 * ContextLinks 
 * Written By Jesse Rochman
 * Created: January 30, 2008
 * Updated: February 4, 2008
 * Version 1.1
 *
 * Events: OnWebPagePrerender - Choose to have the replace done after parsing of the document
 *             OnLoadWebDocument -  Choose to have the replace done prior to the parsing of chunks, snippets, etc.
 *	      ONLY PICK ONE EVENT OR THE OTHER.  DO NOT SELECT BOTH!
 *
 * Paste the following into the Configuration:
 * 		&parents=Parents;string;0 &replace_with=Match Source;string;pagetitle &doc_objects=Document Objects;string;0 &search_type=Search Type;string;0
 * 		
 * Usage:
 *		Parents should be a comma delimited list of IDs for which children you want context links.
 *		Match Source is a document object and would likely be pagetitle, alias, longtitle, description, or menutitle.
 *		Document Objects -  Create a comma delimited list of pagetitle, longtitle, description, content, or nameoftv to narrow the scope of replacement.
 *      					  Right now, Document Objects only works when OnLoadWebDocument is the event being used.
 *                 Search Type - 0, 1 
 *				0: Somewhat smarter whole word search, but a little agressive.  If Keyword is "Man".  The plugin will not match "manhole."  (This is good).
 *				    Will match "man," "man." "'man;" "'man'" (This is even better).  However, it will also match these keywords if inside attribute fields 
 *				    for your HTML, creating messy links.
 *				1: Dumb whole word search.  Checks for white space on both sides of the string.  If Keyword is "Man".  The plugin will not match "manhole."  (This is good).
 *				    Will not match "man," "man." "'man'" (This is bad because it is thrown off by the punctuation).
 *				2: Dumb whole word search.  Checks for white space in front of the string.  Will match keywords with punctuation at the end of the string, bill not match keywords
 *				    inside quotes (e.g., html attributes) or next to html tags (e.g., <h1>keyword</h1>).
 */

$e= & $modx->Event;
switch ($e->name) {
    case "OnWebPagePrerender" :
		$parents = explode(',',$parents);
		foreach ($parents as $parent) {
			$children = $modx->getActiveChildren($parent,$replace_with,'DESC', $fields= 'id, ' . $replace_with);
			
			foreach ($children as $child) {
				switch ($search_type) {
					case 0 :
						$replaced_string = $child[$replace_with];
						$context_link = '<a href="' . $modx->makeUrl($child['id']) . '">' . $child[$replace_with] . '</a>';
						$modx->documentOutput = preg_replace('`\b' . $replaced_string . '\b`', $context_link, $modx->documentOutput);
					break;
					
					case 1 :
						$replaced_string = ' ' . $child[$replace_with];
						$context_link = ' <a href="' . $modx->makeUrl($child['id']) . '">' . $child[$replace_with] . '</a>';
						$modx->documentOutput = str_replace($replaced_string, $context_link, $modx->documentOutput);
					break;
					
					default :
						$replaced_string = ' ' . $child[$replace_with] . ' ';
						$context_link = ' <a href="' . $modx->makeUrl($child['id']) . '">' . $child[$replace_with] . '</a> ';
						$modx->documentOutput = str_replace($replaced_string, $context_link, $modx->documentOutput);
					break;
				}
			}
		}
        break;
	  
	  case "OnLoadWebDocument" :
			$parents = explode(',',$parents);
			$doc_objects = explode(',',$doc_objects);
			foreach ($parents as $parent) {
				$children = $modx->getActiveChildren($parent,$replace_with,'DESC', $fields= 'id, ' . $replace_with);
				foreach ($children as $child) {
					switch ($search_type) {
					case 0 :
						$replaced_string = $child[$replace_with];
						$context_link = '<a href="' . $modx->makeUrl($child['id']) . '">' . $child[$replace_with] . '</a>';
						foreach ($doc_objects as $doc_object) {
							$modx->documentObject[$doc_object] = preg_replace('`\b' . $replaced_string . '\b`', $context_link, $modx->documentObject[$doc_object]);
						}
					break;
					
					case 1 :
						$replaced_string = ' ' . $child[$replace_with];
						$context_link = ' <a href="' . $modx->makeUrl($child['id']) . '">' . $child[$replace_with] . '</a>';
						foreach ($doc_objects as $doc_object) {
							$modx->documentObject[$doc_object] = str_replace($replaced_string, $context_link, $modx->documentObject[$doc_object]);
						}
					break;
					
					default :
						$replaced_string = ' ' . $child[$replace_with] . ' ';
						$context_link = ' <a href="' . $modx->makeUrl($child['id']) . '">' . $child[$replace_with] . '</a> ';
						foreach ($doc_objects as $doc_object) {
							$modx->documentObject[$doc_object] = str_replace($replaced_string, $context_link, $modx->documentObject[$doc_object]);
						}
					break;
					}		
				}
			}
        break;
    default :
       return; // stop here - this is very important. 
}