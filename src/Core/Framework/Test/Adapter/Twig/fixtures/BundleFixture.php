<?php declare(strict_types=1);

namespace Shopware\Core\Framework\Test\Adapter\Twig\fixtures;

use Shopware\Core\Framework\Bundle;

class BundleFixture extends Bundle
{
    /**
     * @var string
     */
    protected $path;

    /**
     * @var string
     */
    protected $name;

    public function __construct(string $name, string $path)
    {
        $this->name = $name;
        $this->path = $path;
    }
}
