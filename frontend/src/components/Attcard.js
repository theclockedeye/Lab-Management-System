import React from "react";

class AttCard extends React.Component {
  constructor(props) {
    super(props);
    this.addAttendanceModalRef = React.createRef();
  }

  handleAddButtonClick() {
    this.addAttendanceModalRef.current.showModal();
  }

  render() {
    return (
      <>
        {/* Main content */}
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
          <div className="container" style={{ marginTop: "30px" }}>
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-md-9">Attendance List</div>
                  <div className="col-md-3" align="right">
                    <button
                      type="button"
                      id="add_button"
                      className="btn btn-danger btn-sm"
                      onClick={() => this.handleAddButtonClick()}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      id="edit_button"
                      className="btn btn-success btn-sm"
                      data-toggle="modal"
                      data-target="#editAttendanceModal"
                    >
                      Edit
                    </button>
                    <button type="button" className="btn btn-info btn-sm">
                      Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Add Attendance Modal */}
        <div
          className="modal fade"
          id="addAttendanceModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLongTitle"
          aria-hidden="true"
          ref={this.addAttendanceModalRef}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Add Attendance
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form action="" method="post">
                  <input
                    type="hidden"
                    name="csrfmiddlewaretoken"
                    value="JXxuKqjgNkVnulTUJeBA2YiJeu9dAeLLCKTzhuXgenHKjeL86TMXtp1eOG6vg9ej"
                  />
                  <div className="form-group row">
                    <label htmlFor="date" className="col-sm-4 col-form-label">
                      Attendance Date
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="date"
                        name="date"
                        id="date"
                        className="form-control"
                        min="2020-06-06"
                        max="2021-03-31"
                        required
                      />
                      <span className="validity"></span>
                    </div>
                  </div>
                  {/* Add more form fields here if needed */}
                  <div className="table-responsive">
                    <table
                      className="table table-striped table-bordered"
                      id="attendance_table_modal"
                    >
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Roll Number</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Jissin Sam</td>
                          <td>18410</td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                name="18410"
                                className="switch-input"
                              />
                              <span
                                className="switch-label"
                                data-off="Present"
                                data-on="Absent"
                              ></span>
                              <span className="switch-handle"></span>
                            </label>
                          </td>
                        </tr>
                        <tr>
                          <td>Deepu Kochumon</td>
                          <td>8888</td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                name="8888"
                                className="switch-input"
                              />
                              <span
                                className="switch-label"
                                data-off="Present"
                                data-on="Absent"
                              ></span>
                              <span className="switch-handle"></span>
                            </label>
                          </td>
                        </tr>
                        {/* Add more rows here if needed */}
                      </tbody>
                    </table>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Attendance Modal */}
        <div
          className="modal fade"
          id="editAttendanceModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLongTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Edit Attendance
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form
                  action="/faculty/search%3Fq=link+for+django+admin&amp;oq=link+for+django+facultye&amp;aqs=chrome..69i57j0i22i30i457.7240j1j4&amp;sourceid=chrome&amp;ie=UTF-8/"
                  method="post"
                >
                  <input
                    type="hidden"
                    name="csrfmiddlewaretoken"
                    value="JXxuKqjgNkVnulTUJeBA2YiJeu9dAeLLCKTzhuXgenHKjeL86TMXtp1eOG6vg9ej"
                  />
                  <div className="modal-body">
                    <div className="form-group row">
                      <label htmlFor="date" className="col-sm-4 col-form-label">
                        Attendance Date
                      </label>
                      <div className="col-sm-6">
                        <input
                          type="date"
                          name="date"
                          id="date"
                          className="form-control"
                          min="2020-06-06"
                          max="2021-03-31"
                          required
                        />
                        <span className="validity"></span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table
                          className="table table-striped table-bordered"
                          id="attendance_table_modal"
                        >
                          <thead>
                            <tr>
                              <th>Student Name</th>
                              <th>Roll Number</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Jissin Sam</td>
                              <td>18410</td>
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="18410"
                                    className="switch-input"
                                  />
                                  <span
                                    className="switch-label"
                                    data-off="Change"
                                    data-on="Changed"
                                  ></span>
                                  <span className="switch-handle"></span>
                                </label>
                              </td>
                            </tr>
                            <tr>
                              <td>Deepu Kochumon</td>
                              <td>8888</td>
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="8888"
                                    className="switch-input"
                                  />
                                  <span
                                    className="switch-label"
                                    data-off="Change"
                                    data-on="Changed"
                                  ></span>
                                  <span className="switch-handle"></span>
                                </label>
                              </td>
                            </tr>
                            {/* Add more rows here if needed */}
                          </tbody>
                        </table>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Save changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AttCard;
