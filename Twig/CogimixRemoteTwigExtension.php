<?php
namespace Cogipix\CogimixRemoteControlBundle\Twig;

class CogimixRemoteTwigExtension extends \Twig_Extension
{
    const BROWSER_NODE_URL = "browser_node_url";
    const REMOTE_NODE_URL = "remote_node_url";

    private $nodeHost;

    public function __construct($nodeHostParameter){
        $this->nodeHost = $nodeHostParameter;
    }

    public function getGlobals() {


        return array(
                CogimixRemoteTwigExtension::BROWSER_NODE_URL=>$this->nodeHost.'/browser',
                CogimixRemoteTwigExtension::REMOTE_NODE_URL => $this->nodeHost.'/mobile');
    }


    public function getName()
    {
        return 'cogimix_remote_extension';
    }
}