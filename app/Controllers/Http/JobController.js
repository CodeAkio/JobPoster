'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Job = use('App/Models/Job')

class JobController {
  /**
   * Show a list of all jobs.
   * GET jobs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ view }) {
    const jobs = await Job.all()

    return view.render('index', { jobs: jobs.toJSON() })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async userIndex({view, auth}) {
    const jobs = await auth.user.jobs().fetch();

    return view.render('jobs', { jobs: jobs.toJSON() })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, session, auth}) {
    const job = request.all();

    const posted = await auth.user.jobs().create({
      title: job.title,
      link: job.link,
      description: job.description
    });

    session.flash({ message: 'Your job has been posted!' });
    return response.redirect('back');
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async delete({ response, session, params}) {
    const job = await Job.find(params.id);

    await job.delete();
    session.flash({ message: 'Your job has been removed'});
    return response.redirect('back');
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, view }) {
    const job = await Job.find(params.id);
    return view.render('edit', { job: job });
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async update ({ response, request, session, params }) {
    const job = await Job.find(params.id);

    job.title = request.all().title;
    job.link = request.all().link;
    job.description = request.all().description;

    await job.save();

    session.flash({ message: 'Your job has been updated. '});
    return response.redirect('/post-a-job');
  }
}

module.exports = JobController
