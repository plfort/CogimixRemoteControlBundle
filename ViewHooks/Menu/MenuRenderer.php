<?php
namespace Cogipix\CogimixRemoteControlBundle\ViewHooks\Menu;
use Cogipix\CogimixCommonBundle\ViewHooks\Menu\MenuItemAlwaysDisplayInterface;

use Cogipix\CogimixCommonBundle\ViewHooks\Menu\MenuItemInterface;

/**
 *
 * @author plfort - Cogipix
 *
 */
class MenuRenderer implements MenuItemAlwaysDisplayInterface
{

    public function getMenuItemAlwaysDisplayTemplate()
    {
         return 'CogimixRemoteControlBundle:Menu:menu.html.twig';

    }

}
