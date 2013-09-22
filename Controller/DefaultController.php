<?php

namespace Cogipix\CogimixRemoteControlBundle\Controller;

use Symfony\Component\HttpFoundation\Request;

use Cogipix\CogimixDropboxBundle\Entity\AccessToken;

use JMS\SecurityExtraBundle\Annotation\Secure;
use Cogipix\CogimixCommonBundle\Utils\AjaxResult;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
/**
 * @Route("/remote")
 * @author plfort - Cogipix
 *
 */
class DefaultController extends Controller
{
    /**
     * @Route("/{token}",name="_remote_control_page",options={"expose"=true})
     *
     */
    public function remoteControlAction($token)
    {
        return $this->render('CogimixRemoteControlBundle::remote.html.twig',array('token'=>$token));
    }

}
