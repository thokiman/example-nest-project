import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/users.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/update-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';


@Controller('reports')
export class ReportsController {


    constructor(
        private reportsService: ReportsService
    ) {

    }

    @Get('/')
    getEstimate(
        @Query() query: GetEstimateDto
    ) {
        return this.reportsService.createEstimate(query)
    }

    // The last thing we might want to do is make sure that only users who are authenticated are able to access this route.
    // You might recall that we had previously put together something called a guard when we were dealing with authentication.
    @Post('/')
    @UseGuards(AuthGuard) // So, again, that's just going to ensure that a user is actually signed in before they can create a report.
    @Serialize(ReportDto)
    createReport(
        @CurrentUser() user: User,
        @Body() body: CreateReportDto
    ) {
        return this.reportsService.create(body, user)
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(
        @Param('id') id: string,
        @Body() body: ApproveReportDto
    ) {
        return this.reportsService.changeApproval(id, body.approved)
    }

    



}
