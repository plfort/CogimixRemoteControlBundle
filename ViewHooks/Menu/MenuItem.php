<?php
namespace Cogipix\CogimixRemoteControlBundle\ViewHooks\Menu;
use Cogipix\CogimixCommonBundle\ViewHooks\Menu\MainMenuItemInterface;

use Cogipix\CogimixCommonBundle\ViewHooks\Menu\MenuItemInterface;
use Cogipix\CogimixCommonBundle\ViewHooks\Menu\AbstractMenuItem;

/**
 *
 * @author plfort - Cogipix
 *
 */
class MenuItem  extends AbstractMenuItem
{

    public function getMenuItemTemplate()
    {
         return 'CogimixRemoteControlBundle:Menu:menu.html.twig';

    }

    public function getName(){
    	return 'remotecontrol';
    }

}
