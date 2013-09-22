<?php
namespace Cogipix\CogimixRemoteControlBundle\ViewHooks\Css;
use Cogipix\CogimixCommonBundle\ViewHooks\Css\CssImportInterface;


/**
 *
 * @author plfort - Cogipix
 *
 */
class CssImportRenderer implements CssImportInterface
{

    public function getCssImportTemplate()
    {
        return 'CogimixRemoteControlBundle::css.html.twig';
    }

}
