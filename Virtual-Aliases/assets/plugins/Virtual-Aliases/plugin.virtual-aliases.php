//<?php
// Virtual Aliases
// version 0.0.2
// Allows for an unlimited number of custom aliases per page.
// By Brian Stanback @ www.stanback.net
 
// On Install: Check the the "OnPageNotFound" box in the System Events tab.
// Plugin configuration: &aliasesTV=Aliases TV name;string;Aliases
 
// For overriding documents, create a new template variabe (TV) named
// Aliases with the following option:
//    Input Type: Textarea (Smaller)
// 
// Aliases should be added to the TV, one per line. 
// Omit any leading or trailing slashes as well as the default suffix (usaully .html)
 
// Begin plugin code
$e = &$modx->event;
 
if ($e->name == "OnPageNotFound") 
{
   // Retrieve requested path + alias
   $documentAlias = trim($_SERVER['REQUEST_URI'], '/');

   // Search TVs for potential alias matches
   $sql = "SELECT tvc.contentid as id, tvc.value as value FROM " . $modx->getFullTableName('site_tmplvars') . " tv ";
   $sql .= "INNER JOIN " . $modx->getFullTableName('site_tmplvar_templates') . " tvtpl ON tvtpl.tmplvarid = tv.id ";
   $sql .= "LEFT JOIN " . $modx->getFullTableName('site_tmplvar_contentvalues') . " tvc ON tvc.tmplvarid = tv.id ";
   $sql .= "LEFT JOIN " . $modx->getFullTableName('site_content') . " sc ON sc.id = tvc.contentid ";
   $sql .= "WHERE sc.published = 1 AND tvtpl.templateid = sc.template AND tv.name = '$aliasesTV' AND tvc.value LIKE '%" . $modx->db->escape($documentAlias) . "%'";
   $results = $modx->dbQuery($sql);
 
   // Attempt to find an exact match
   $found = 0;
   while ($found == 0 && $row = $modx->db->getRow($results))
   {
      $pageAliases = explode("\n", $row["value"]);
      while ($found == 0 && $alias = each($pageAliases))
      {
         if (trim($alias[1]) == $documentAlias)  // Check for a match
            $found = $row["id"];
      }
   }
 
   if($found)  // Redirect to new document, if an alias was found
   {
      $pageUrl = $modx->makeUrl($found, '', '', "full");
      $modx->sendRedirect($pageUrl, 0, "REDIRECT_HEADER", 'HTTP/1.1 301 Moved Permanently');
      exit(0);
   }
 
   header("HTTP/1.0 404 Not Found");
   header("Status: 404 Not Found");
}