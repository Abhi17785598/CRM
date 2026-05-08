using Xunit;

namespace MyCrmApp.EntityFrameworkCore;

[CollectionDefinition(MyCrmAppTestConsts.CollectionDefinitionName)]
public class MyCrmAppEntityFrameworkCoreCollection : ICollectionFixture<MyCrmAppEntityFrameworkCoreFixture>
{

}
